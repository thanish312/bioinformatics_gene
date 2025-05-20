import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function FileUpload({ file, loading, error, onFileChange, onSubmit }) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upload your genome file
      </Typography>
      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        accept=".vcf,.txt"
        style={{ display: 'none' }}
        onChange={onFileChange}
        disabled={loading}
      />
      {/* Only the button is visible */}
      <label htmlFor="file-upload" style={{ width: '100%' }}>
        <Button
          component="span"
          variant="outlined"
          fullWidth
          startIcon={<CloudUploadIcon />}
          sx={{
            color: '#222',
            borderColor: '#bbb',
            background: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 0,
            '&:hover': {
              background: '#f5f5f5',
              borderColor: '#222',
            },
            mb: 1,
          }}
          disabled={loading}
        >
          {file ? 'Change File' : 'Choose File'}
        </Button>
      </label>
      {file && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: -1, mb: 1 }}>
          Selected: {file.name}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        size="large"
        sx={{
          mt: 1,
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
          borderRadius: 2,
          letterSpacing: 1,
          boxShadow: 3,
          textTransform: 'none',
          background: '#222',
          color: '#fff',
          '&:hover': {
            background: '#444',
          },
        }}
      >
        {loading ? <CircularProgress color="inherit" size={26} /> : 'Upload & Analyze'}
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}