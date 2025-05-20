// index.js
import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import { GoogleGenAI } from "@google/genai"; // Ensure this is the correct SDK import

const app = express()
app.use(cors())
app.use(express.json())

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){ fs.mkdirSync(dir, { recursive: true }); }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.vcf') || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .vcf and .txt files are allowed.'), false);
    }
  }
});

// Initialize GenAI client
let ai;
try {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
    console.error("FATAL: Failed to initialize GoogleGenAI client:", e.message);
    process.exit(1);
}

// --- Configuration for Variant Prioritization ---
const MIN_VARIANT_QUALITY = 30;
const MAX_VARIANTS_TO_REPORT = 5;
const MAX_ALLELE_FREQUENCY_COMMON = 0.01;
const INTERESTING_CONSEQUENCES = [
    'transcript_ablation', 'splice_acceptor_variant', 'splice_donor_variant',
    'stop_gained', 'frameshift_variant', 'stop_lost', 'start_lost',
    'transcript_amplification', 'inframe_insertion', 'inframe_deletion',
    'missense_variant', 'protein_altering_variant', 'splice_region_variant',
    'incomplete_terminal_codon_variant', 'start_retained_variant',
    'stop_retained_variant', 'synonymous_variant',
];
const CONSEQUENCE_PRIORITY = INTERESTING_CONSEQUENCES.reduce((acc, val, idx) => {
    acc[val] = idx; return acc;
}, {});

// --- Highly Robust Gene Info Extraction ---
function extractMeaningfulGeneInfo(fileContent) {
  console.log("--- Inside extractMeaningfulGeneInfo ---");
  if (!fileContent || fileContent.trim() === '') {
    console.log("extractMeaningfulGeneInfo: File content is empty.");
    return { error: "File is empty or contains no processable content.", variants: [], genes: [] };
  }
  const lines = fileContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  if (lines.length === 0) {
    console.log("extractMeaningfulGeneInfo: No data lines after filtering headers.");
    return { error: "No data lines found in VCF file after filtering headers.", variants: [], genes: [] };
  }
  console.log(`extractMeaningfulGeneInfo: Found ${lines.length} data lines to process.`);

  const processedVariants = [];
  let qualityFiltersAppliedCount = 0;
  let afFiltersAppliedCount = 0;
  let consequenceFiltersAppliedCount = 0;

  for (const line of lines) {
    if (processedVariants.length >= MAX_VARIANTS_TO_REPORT) {
        console.log("extractMeaningfulGeneInfo: Reached MAX_VARIANTS_TO_REPORT.");
        break;
    }

    const parts = line.split('\t');
    if (parts.length < 8) { console.log(`extractMeaningfulGeneInfo: Skipping malformed line (not enough columns): ${line.substring(0,30)}...`); continue; }

    const [chrom, pos, id, ref, alt, qualStr, filter, infoStr] = parts;

    if (!chrom || !pos || !ref || !alt || ref === '.' || alt === '.' || alt === '*' || alt.includes('<')) {
        console.log(`extractMeaningfulGeneInfo: Skipping line with invalid core fields: ${line.substring(0,30)}...`);
        continue;
    }

    const quality = parseFloat(qualStr);
    if (isNaN(quality) || quality < MIN_VARIANT_QUALITY) {
        console.log(`extractMeaningfulGeneInfo: Skipping low quality (QUAL: ${quality}): ${line.substring(0,30)}...`);
        qualityFiltersAppliedCount++;
        continue;
    }

    if (filter.toUpperCase() !== 'PASS' && filter !== '.') {
        console.log(`extractMeaningfulGeneInfo: Skipping filtered (FILTER: ${filter}): ${line.substring(0,30)}...`);
        qualityFiltersAppliedCount++;
        continue;
    }

    const infoMap = {};
    infoStr.split(';').forEach(field => {
      const [key, ...valueParts] = field.split('=');
      infoMap[key] = valueParts.join('=') || true;
    });

    const alleleFrequencyStr = infoMap.AF || infoMap.GMAF || infoMap.gnomAD_AF;
    if (alleleFrequencyStr) {
        const alleleFrequencies = alleleFrequencyStr.split(',').map(parseFloat);
        const maxAf = Math.max(...alleleFrequencies.filter(af => !isNaN(af)));
        if (!isNaN(maxAf) && maxAf > MAX_ALLELE_FREQUENCY_COMMON) {
            console.log(`extractMeaningfulGeneInfo: Skipping common variant (AF: ${maxAf}): ${id || chrom+':'+pos}`);
            afFiltersAppliedCount++;
            continue;
        }
    }

    let bestAnnotation = null;
    if (infoMap.ANN || infoMap.EFF) {
      const annotations = (infoMap.ANN || infoMap.EFF).split(',');
      for (const ann of annotations) {
        const fields = ann.split('|');
        if (fields.length > 3) {
          const currentConsequences = fields[1].split('&');
          const geneName = fields[3];
          for (const cons of currentConsequences) {
            if (INTERESTING_CONSEQUENCES.includes(cons)) {
              const priority = CONSEQUENCE_PRIORITY[cons];
              if (!bestAnnotation || priority < CONSEQUENCE_PRIORITY[bestAnnotation.consequence.split('&')[0]]) {
                bestAnnotation = {
                  allele: fields[0], consequence: fields[1], impact: fields[2], geneName: geneName,
                };
              }
            }
          }
        }
      }
    }

    if (!bestAnnotation) {
        console.log(`extractMeaningfulGeneInfo: Skipping variant with no prioritized annotation: ${id || chrom+':'+pos}`);
        consequenceFiltersAppliedCount++;
        continue;
    }
    console.log(`extractMeaningfulGeneInfo: ACCEPTED variant: ${id || chrom+':'+pos} with consequence: ${bestAnnotation.consequence} in gene: ${bestAnnotation.geneName}`);
    processedVariants.push({
      representation: `${id && id !== '.' ? id : `${chrom}:${pos}`} ${ref}>${alt}`,
      chrom, pos, id, ref, alt, qual: quality, filter,
      gene: bestAnnotation.geneName || 'N/A',
      consequence: bestAnnotation.consequence,
      impact: bestAnnotation.impact,
    });
  }
  console.log(`extractMeaningfulGeneInfo: Filter summary - Quality/Filter skips: ${qualityFiltersAppliedCount}, AF skips: ${afFiltersAppliedCount}, Consequence skips: ${consequenceFiltersAppliedCount}`);

  processedVariants.sort((a, b) => {
    const priorityA = CONSEQUENCE_PRIORITY[a.consequence.split('&')[0]] ?? Infinity;
    const priorityB = CONSEQUENCE_PRIORITY[b.consequence.split('&')[0]] ?? Infinity;
    return priorityA - priorityB;
  });

  const finalVariantsToReport = processedVariants.slice(0, MAX_VARIANTS_TO_REPORT);
  console.log(`extractMeaningfulGeneInfo: Final variants to report to AI: ${finalVariantsToReport.length}`);

  if (finalVariantsToReport.length === 0) {
    const reason = `No variants passed all filtering criteria. (Quality/Filter skips: ${qualityFiltersAppliedCount}, AF skips: ${afFiltersAppliedCount}, Consequence skips: ${consequenceFiltersAppliedCount})`;
    console.log(`extractMeaningfulGeneInfo: ${reason}`);
    return { error: reason, variants: [], genes: [] };
  }

  const variantSummaryForPrompt = finalVariantsToReport.map(v => `${v.representation} (Gene: ${v.gene}, Effect: ${v.consequence})`).join('; ');
  const genes = Array.from(new Set(finalVariantsToReport.map(v => v.gene).filter(g => g && g !== 'N/A')));

  console.log("--- Exiting extractMeaningfulGeneInfo ---");
  return {
    variantSummary: variantSummaryForPrompt,
    variants: finalVariantsToReport,
    genes: genes,
    error: null
  };
}

// --- Prompt Loading ---
let promptTemplate = '';
try {
  if (process.env.GENAI_PROMPT) {
    promptTemplate = process.env.GENAI_PROMPT;
  } else {
    promptTemplate = fs.readFileSync('prompt.txt', 'utf8');
    console.log("Loaded prompt from prompt.txt");
  }
  if (!promptTemplate) {
    throw new Error("Prompt template is empty after attempting to load.");
  }
} catch (err) {
  console.error("FATAL: Could not load prompt template.", err);
  process.exit(1);
}

app.post('/api/predict', (req, res) => {
  upload.single('file')(req, res, async function (err) {
    if (err instanceof multer.MulterError) { console.error('Multer error:', err); return res.status(400).json({ error: `File upload error: ${err.message}` }); }
    if (err) { console.error('Unknown upload error:', err); return res.status(400).json({ error: err.message || 'File upload failed.' }); }
    if (!req.file) { console.log('No file uploaded in request.'); return res.status(400).json({ error: 'No file uploaded.' }); }

    const filePath = req.file.path;
    console.log(`Received file: ${req.file.originalname}, saved to: ${filePath}`);
    let age = 25; // Placeholder
    let gender = 'female'; // Placeholder

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { variantSummary, variants, genes, error: extractError } = extractMeaningfulGeneInfo(fileContent);

      // --- DEBUG LOGGING for extractGeneInfo output ---
      console.log("--- Extracted Info from VCF ---");
      console.log("Extract Error:", extractError);
      console.log("Variant Summary for Prompt:", variantSummary);
      console.log("Number of Processed Variants (to be sent to AI):", variants ? variants.length : 0);
      if (variants && variants.length > 0) {
        console.log("First Processed Variant Details:", JSON.stringify(variants[0], null, 2));
      }
      console.log("Extracted Genes for Prompt:", genes);
      console.log("---------------------------------");
      // --- END DEBUG LOGGING ---

      if (extractError || !variantSummary) {
        const message = `Could not process file: ${extractError || 'No high-confidence, impactful variants found.'}`;
        console.warn(`${message} for file: ${req.file.originalname}`);
        // fs.unlink below in finally block will handle deletion
        return res.status(400).json({ error: message });
      }

      let detailedVariantInfoForPrompt = "";
      if (variants && variants.length > 0) {
        detailedVariantInfoForPrompt = "\nKey variants considered for analysis (effects are based on VCF annotations):\n" +
          variants.map(v => `- Variant: ${v.representation}, Gene: ${v.gene || 'N/A'}, Predicted Effect: ${v.consequence || 'N/A'}, Impact: ${v.impact || 'N/A'}, QUAL: ${v.qual}`).join("\n");
      }
      const geneListString = genes && genes.length > 0 ? genes.join(', ') : "not specifically identified from these filtered variants";

      const filledPrompt = promptTemplate
        .replace(/\$\{age\}/g, age.toString())
        .replace(/\$\{gender\}/g, gender)
        .replace(/\$\{variantSummary\}/g, variantSummary)
        .replace(/\$\{geneList\}/g, geneListString)
        .replace(/\$\{detailedVariantInfo\}/g, detailedVariantInfoForPrompt);

      // --- DEBUG LOGGING for AI Prompt ---
      console.log("--- Prompt Sent to AI ---");
      console.log(filledPrompt);
      console.log("-------------------------");
      // --- END DEBUG LOGGING ---

      const generationConfig = { temperature: 0.5, topK: 1, topP: 1, maxOutputTokens: 3000 };

      const apiResult = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: filledPrompt }] }],
        generationConfig,
      });

      // --- DEBUG LOGGING for Raw AI API Result ---
      console.log("--- Raw AI API Result ---");
      console.log(JSON.stringify(apiResult, null, 2));
      console.log("-------------------------");
      // --- END DEBUG LOGGING ---

      let rawText;
      if (typeof apiResult.text === 'function') { rawText = await apiResult.text(); }
      else if (apiResult.text) { rawText = apiResult.text; }
      else if (apiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
        rawText = apiResult.candidates[0].content.parts[0].text;
      } else {
        console.error('CRITICAL: AI text response not found in expected locations within apiResult.');
        // No throw here yet, let the !rawText check below handle it
      }

      // --- DEBUG LOGGING for Extracted Raw Text ---
      console.log("--- Extracted Raw Text from AI ---");
      console.log(rawText);
      console.log("----------------------------------");
      // --- END DEBUG LOGGING ---

      if (!rawText) {
        console.error('AI returned empty or unextractable raw text. See full API result above.');
        throw new Error('AI returned an empty text response or text could not be extracted.');
      }

      let jsonOutput;
      try {
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
        if (jsonMatch) {
          jsonOutput = JSON.parse(jsonMatch[1] || jsonMatch[2]);
        } else {
          console.warn('No clear JSON block (```json or {...}) found in AI response. Attempting to parse raw text as JSON. Raw text was:', rawText);
          jsonOutput = JSON.parse(rawText);
        }
      } catch (e) {
        console.error('AI response JSON parsing failed. Raw text was:', rawText, 'Error:', e);
        return res.status(500).json({ error: 'Failed to parse AI response. The AI returned non-JSON or malformed JSON.' });
      }

      // --- DEBUG LOGGING for Parsed JSON Output ---
      console.log("--- Parsed JSON Output (from AI) ---");
      console.log(JSON.stringify(jsonOutput, null, 2));
      console.log("------------------------------------");
      // --- END DEBUG LOGGING ---

      const finalResponse = {
          aiAnalysis: jsonOutput,
          processedVariantsInput: variants.map(v => ({
              variant: v.representation, gene: v.gene, consequence: v.consequence,
              impact: v.impact, quality: v.qual
          })),
          identifiedGenesForPrompt: genes
      };
      console.log("--- Final Response to Frontend ---");
      console.log(JSON.stringify(finalResponse, null, 2));
      console.log("----------------------------------");
      res.json(finalResponse);

    } catch (err) {
      console.error('Prediction process failed:', err.message, err.stack);
      // Ensure filePath is defined before trying to unlink in catch if req.file was processed
      const fileToDelete = filePath || (req.file ? req.file.path : null);
      if (fileToDelete && fs.existsSync(fileToDelete)) {
          fs.unlink(fileToDelete, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file after error:", fileToDelete, unlinkErr); });
      }
      res.status(500).json({ error: `Prediction process failed: ${err.message}` });
    } finally {
      // Ensure file is deleted if it still exists and filePath was defined
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting uploaded file in finally block:", filePath, unlinkErr);
          else console.log(`Successfully deleted file: ${filePath}`);
        });
      } else if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        // Fallback if filePath wasn't set due to early error but req.file exists
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting uploaded file (fallback) in finally block:", req.file.path, unlinkErr);
          else console.log(`Successfully deleted file (fallback): ${req.file.path}`);
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));