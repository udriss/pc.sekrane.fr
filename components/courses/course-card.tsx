import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip,
  Stack
} from "@mui/material";
import {
  ArrowForward as ArrowRight
} from "@mui/icons-material";
import type { Course } from "@/lib/dataTemplate";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const isDisabled = course.isDisabled ?? false;
  const cardOpacity = course.isHidden ? 0.5 : 1;
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
        opacity: cardOpacity,
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
          p: 2,
          pb: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 1,
            justifyContent: 'flex-end'
          }}
        >
          {isDisabled && (
            <Chip
              label="Désactivé"
              size="small"
              color="warning"
              variant="outlined"
              sx={{
                fontWeight: 'bold'
              }}
            />
          )}
          <Chip
            label={course.classe}
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: 'medium'
            }}
          />
        </Stack>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom={false}
          sx={{
            fontWeight: 'bold',
            color: '#1a237e'
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
        <Tooltip title={isDisabled ? "Ce cours est temporairement désactivé" : "Voir les activités"}>
          <span style={{ display: 'block', width: '100%' }}>
            <Button 
              component={NextLink}
              href={`/courses/${course.id}`}
              variant="contained" 
              color="primary"
              endIcon={<ArrowRight fontSize='medium' />}
              fullWidth
              disabled={isDisabled}
              onClick={isDisabled ? (event) => event.preventDefault() : undefined}
              sx={{
                borderRadius: 2,
                py: 1,
                backgroundColor: isDisabled ? '#9e9e9e' : '#000000',
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: isDisabled ? '#9e9e9e' : '#333333',
                  transform: isDisabled ? 'none' : 'translateY(-2px)',
                  boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(0,0,0,0.25)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Voir les activités
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}