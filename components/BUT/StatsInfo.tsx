import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

const configMathJax = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]]
  }
};

export const StatsInfo = () => {
    const explanations = [
        {
          symbol: `$\\overline{X}$`,
          name: `Moyenne de $X$`,
          explanation: `$\\overline{X} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$`,
          description: `Centre de gravité des données $X$. Représente la valeur typique ou centrale de la distribution.`
        },
        {
          symbol: `$\\overline{Y}$`,
          name: `Moyenne de $Y$`,
          explanation: `$\\overline{Y} = \\frac{1}{n}\\sum_{i=1}^{n} y_i$`,
          description: `Centre de gravité des données $Y$. Représente la valeur typique ou centrale de la distribution.`
        },
        {
          symbol: `$\\sigma^2_X$`,
          name: `Variance de $X$`,
          explanation: `$\\sigma^2_X = \\frac{1}{n}\\sum_{i=1}^{n} (x_i - \\overline{X})^2$`,
          description: `Mesure la dispersion des valeurs $X$ autour de leur moyenne. Plus elle est grande, plus les données sont étalées.`
        },
        {
          symbol: `$\\sigma^2_Y$`,
          name: `Variance de $Y$`,
          explanation: `$\\sigma^2_Y = \\frac{1}{n}\\sum_{i=1}^{n} (y_i - \\overline{Y})^2$`,
          description: `Mesure la dispersion des valeurs $Y$ autour de leur moyenne. Plus elle est grande, plus les données sont étalées.`
        },
        {
          symbol: `$Cov(X,Y)$`,
          name: "Covariance",
          explanation: `$Cov(X,Y) = \\frac{1}{n}\\sum_{i=1}^{n} (x_i - \\overline{X})(y_i - \\overline{Y})$`,
          description: `Mesure comment $X$ et $Y$ varient ensemble. Une covariance positive indique que $X$ et $Y$ augmentent ensemble.`
        },
        {
          symbol: `$r(X,Y)$`,
          name: "Coefficient de corrélation",
          explanation: `$r_{X,Y} = \\frac{Cov(X,Y)}{\\sqrt{\\sigma^2_X \\sigma^2_Y}}$`,
          description: `Mesure normalisée (entre -1 et 1) de la relation linéaire entre $X$ et $Y$. Plus $\\left|r\\right|$ est proche de 1, plus la relation est forte.`
        },
        {
          symbol: `$\\alpha$`,
          name: "Pente de régression",
          explanation: `$\\alpha = \\frac{Cov(X,Y)}{\\sigma^2_X}$`,
          description: `Indique la variation de $Y$ pour une augmentation d'une unité de $X$. C'est la sensibilité de $Y$ par rapport à $X$.`
        },
        {
          symbol: `$\\beta$`,
          name: "Ordonnée à l'origine",
          explanation: `$\\beta = \\overline{Y} - \\alpha\\overline{X}$`,
          description: `Valeur de $Y$ quand $X=0$. C'est le point d'intersection de la droite de régression avec l'axe $Y$.`
        },
        {
          symbol: `$R^2$`,
          name: "Coefficient de détermination",
          explanation: `$R^2 = r_{X,Y}^2$`,
          description: `Pourcentage de la variance de $Y$ expliquée par $X$. Un $R^2$ proche de 1 indique une bonne qualité d'ajustement.`
        }
      ];

  return (
    <MathJaxContext config={configMathJax}>
        <div className="mt-4">
            <Typography variant="h6" className="mb-2">
            Explications des paramètres statistiques
            </Typography>
            {explanations.map((item, index) => (
            <Accordion 
            key={index}
            sx={{
              borderRadius: '12px !important',
              marginBottom: '8px',
              '&:before': {
                display: 'none',
              },
              '& .MuiAccordionSummary-root': {
                borderRadius: '12px',
              },
              '& .MuiAccordionDetails-root': {
                borderRadius: '0 0 12px 12px',
              }
            }}
          >
                <AccordionSummary expandIcon={<ChevronDown />}>
                <div className="flex items-center gap-2">
                <Typography>{item.name} : </Typography>
                    <MathJax>{item.symbol}</MathJax>
                </div>
                </AccordionSummary>
                <AccordionDetails>
                <div className="space-y-2">
                    <MathJax>{item.explanation}</MathJax>
                    <Typography variant="body2" color="text.secondary" className="mt-2">
                    {item.description}
                    </Typography>
                </div>
                </AccordionDetails>
            </Accordion>
            ))}
        </div>
    </MathJaxContext>
  );
};