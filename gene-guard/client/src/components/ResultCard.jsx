// ResultCard.jsx
import React from 'react';
import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Fade,
  Divider, // For visual separation
  Alert, // For limitations
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For main title
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // For risk chip
// You might want specific icons for diseases, genes, recommendations sections
// import BiotechIcon from '@mui/icons-material/Biotech'; // Example for Genes
// import HealingIcon from '@mui/icons-material/Healing'; // Example for Diseases
// import LightbulbIcon from '@mui/icons-material/Lightbulb'; // Example for Recommendations

// Define riskColors here or import. Ensure it covers all possible riskLevel strings from AI
const riskColors = {
  High: 'error',
  Moderate: 'warning',
  Low: 'success',
  "Very High": 'error',
  "Indeterminate/Insufficient Data": 'default',
  "No Significant Risk Detected": 'info',
  // Add any other riskLevel strings your AI might return
};

export default function ResultCard({ result }) { // 'result' is the prop passed from App.jsx
  // console.log('ResultCard received full props.result:', JSON.stringify(result, null, 2)); // Keep for debugging

  if (!result || !result.aiAnalysis) {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 4, textAlign: 'center' }}>
        <Typography>Waiting for analysis results or data is not available...</Typography>
      </Paper>
    );
  }

  // Destructure from aiAnalysis for easier use
  const {
    riskLevel,
    diseases, // This is now an array of objects: { disease, description, inheritance, confidence }
    genes,    // This is now an array of objects: { geneName, function, implicationOfVariant }
    recommendation,
    summary,
    limitations
  } = result.aiAnalysis;

  const processedVariantsForDisplay = result.processedVariantsInput;

  return (
    <Fade in={!!result.aiAnalysis} timeout={600}>
      <Paper
        elevation={0} // Rely on theme's Paper styling (border) or set specific elevation like 2 or 3
        sx={{
          p: { xs: 2, sm: 3 }, // Consistent padding
          mt: 4,
          width: '100%',
          // borderRadius: (theme) => theme.shape.borderRadius * 1.5, // Example: Slightly larger radius for this card
          // border: (theme) => `1px solid ${theme.palette.divider}`, // Handled by default Paper style from theme
          // Custom background from your original ResultCard can be added here if desired
          // background: (theme) =>
          //   theme.palette.mode === 'dark'
          //     ? 'linear-gradient(135deg, #232936 60%, #2b3142 100%)'
          //     : 'linear-gradient(135deg, #fff 60%, #e3f2fd 100%)',
          // backdropFilter: 'blur(8px)', // If using transparent background
        }}
      >
        <Stack spacing={3}> {/* Consistent spacing */}
          <Typography
            variant="h4" // Or h5 from theme
            component="h2"
            gutterBottom
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // Center title
              color: 'primary.main',
              fontWeight: 'fontWeightBold', // Use theme variable
              // letterSpacing, fontSize can be from theme's h4/h5
            }}
          >
            <CheckCircleIcon sx={{ mr: 1.5, fontSize: 'inherit', color: 'success.main' }} />
            Prediction Analysis
          </Typography>

          {/* Risk Level */}
          {riskLevel && (
            <Box textAlign="center">
              <Typography variant="h6" component="p" fontWeight="fontWeightMedium" display="inline" mr={1.5} color="text.secondary">
                Overall Risk Level:
              </Typography>
              <Chip
                label={riskLevel}
                color={riskColors[riskLevel] || 'default'}
                size="medium"
                icon={<InsertDriveFileIcon fontSize="small" />}
                sx={{
                  fontWeight: 'fontWeightBold',
                  fontSize: '1rem', // Or theme.typography.subtitle1.fontSize
                  px: 2,
                  py: 0.5,
                  // borderRadius: '12px', // Or theme.shape.borderRadius
                  // Gradient background from your original ResultCard can be adapted here:
                  // background: (theme) => result.riskLevel === 'High' ? 'linear-gradient(...)' : ...,
                  // color: result.riskLevel ? theme.palette.getContrastText(theme.palette[riskColors[riskLevel]].main) : undefined, // Ensure contrast
                }}
              />
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          {/* AI Summary */}
          {summary && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'fontWeightMedium' }}>
                AI Summary
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                {summary}
              </Typography>
            </Box>
          )}

          {/* Diseases - Now uses the structured 'diseases' array */}
          {diseases && diseases.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'fontWeightMedium' }}>
                Potential Disease Associations
              </Typography>
              <List dense disablePadding>
                {diseases.map((diseaseItem, idx) => (
                  <Paper
                    variant="outlined" // Or elevation={0} with border from sx
                    key={`disease-${idx}`}
                    sx={{ mb: 1.5, p: 2, borderRadius: (theme) => theme.shape.borderRadius * 0.75 }}
                  >
                    <Typography variant="subtitle1" fontWeight="fontWeightSemiBold" color="primary.dark">
                      {diseaseItem.disease}
                    </Typography>
                    <Typography component="p" variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                      {diseaseItem.description}
                    </Typography>
                    <Typography component="p" variant="caption" color="text.tertiary" sx={{ mt: 1, display: 'block' }}>
                      Inheritance: {diseaseItem.inheritance || 'N/A'} | Confidence: {diseaseItem.confidence || 'N/A'}
                    </Typography>
                  </Paper>
                ))}
              </List>
            </Box>
          )}

          {/* Genes - Now uses the structured 'genes' array */}
          {genes && genes.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'fontWeightMedium' }}>
                Interpreted Gene Information
              </Typography>
              <List dense disablePadding>
                {genes.map((geneItem, idx) => (
                  <Paper
                    variant="outlined"
                    key={`gene-${idx}`}
                    sx={{ mb: 1.5, p: 2, borderRadius: (theme) => theme.shape.borderRadius * 0.75 }}
                  >
                    <Typography variant="subtitle1" fontWeight="fontWeightSemiBold" color="secondary.dark"> {/* Example: using secondary color */}
                      {geneItem.geneName}
                    </Typography>
                    <Typography component="p" variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: 'text.secondary' }}>
                      Function: {geneItem.function || 'N/A'}
                    </Typography>
                    <Typography component="p" variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                      Implication of Variant(s): {geneItem.implicationOfVariant || 'N/A'}
                    </Typography>
                  </Paper>
                ))}
              </List>
            </Box>
          )}

          {/* Processed Variants Input (from backend filter) - Optional but Recommended */}
          {processedVariantsForDisplay && processedVariantsForDisplay.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'fontWeightMedium' }}>
                Key Variants Analyzed
              </Typography>
              <List dense disablePadding>
                {processedVariantsForDisplay.map((variant, idx) => (
                  <ListItem key={`pv-${idx}`} sx={{ flexDirection: 'column', alignItems: 'flex-start', px:0, py: 0.5 }}>
                    <Typography variant="body2" fontWeight="fontWeightMedium">{variant.variant}</Typography>
                    <Typography variant="caption" color="text.tertiary">
                      Gene: {variant.gene || 'N/A'} | Effect: {variant.consequence || 'N/A'} | Impact: {variant.impact || 'N/A'} | Quality: {variant.quality}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Recommendation */}
          {recommendation && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'fontWeightMedium' }}>
                Recommendations
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                {recommendation}
              </Typography>
            </Box>
          )}

          {/* Limitations */}
          {limitations && (
            <Box mt={2} >
              <Alert severity="info" variant="outlined" sx={{ '& .MuiAlert-message': { fontSize: '0.875rem' } }}>
                <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                  <strong>Limitations of this Analysis:</strong><br />
                  {limitations}
                </Typography>
              </Alert>
            </Box>
          )}
        </Stack>
      </Paper>
    </Fade>
  );
}