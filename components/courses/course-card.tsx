import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box,
  Chip,
  IconButton
} from "@mui/material";
import { 
  School as GraduationCap, 
  MenuBook as BookOpen, 
  ArrowForward as ArrowRight 
} from "@mui/icons-material";

interface CourseCardProps {
  course: any;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          // background: 'linear-gradient(90deg, #3f51b5, #7986cb)',
          background: 'black',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          pb: 0
        }}
      >
        <Chip 
          label={course.classe} 
          size="small" 
          color="primary" 
          sx={{ 
            fontWeight: 'medium',
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10
          }} 
        />
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom={false}
          sx={{ 
            fontWeight: 'bold',
            color: '#1a237e',
            pr: 6
          }}
        >
          {course.title}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5
          }}
        >
          {course.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 1 }}>
        <Link href={`/courses/${course.id}`} style={{ width: '100%', textDecoration: 'none' }}>
            <Button 
            variant="contained" 
            color="primary"
            endIcon={<ArrowRight fontSize='medium' />}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1,
              backgroundColor: '#000000',
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
              bgcolor: '#333333',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              },
              transition: 'all 0.3s ease'
            }}
            >
            Voir les activités
            </Button>
        </Link>
      </CardActions>
    </Card>
  );
}