import React from "react";
import "./styles/FAQ.css";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQPage = () => {//hardcoded ipsums for illustration only, later will be changed to actual FAQ
  const faqs = [
    {
      question: "Yar Pirate ipsum?",
      answer:
        "Sloop bucko Sail ho Privateer lateen sail scuttle run a shot across the bow Pirate Round six pounders square-rigged. Gangplank Chain Shot crow's nest gibbet ye ahoy black spot nipper holystone avast. Measured fer yer chains bring a spring upon her cable gangplank crimp lass scurvy Shiver me timbers Pieces of Eight jolly boat gibbet.",
    },
    {
      question: "Cupcake ipsum?",
      answer:
        "Cupcake ipsum dolor sit amet. Pudding croissant marshmallow chocolate cotton candy jelly beans chupa chups. Dessert soufflé toffee sweet sweet cupcake caramels toffee. Muffin marshmallow bonbon dragée carrot cake. Tart brownie marzipan shortbread apple pie topping. Croissant icing sugar plum powder apple pie fruitcake chocolate. Jujubes marshmallow gummi bears bonbon wafer dessert gummies.",
    },
    {
      question: "Pokemon ipsum?",
      answer:
        "Bulbasaur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ivysaur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venusaur Lorem ipsum dolor sit amet, consectetur adipiscing elit. Charmander Lorem ipsum dolor sit amet, consectetur adipiscing elit. Charmeleon Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      question: "Cat ipsum?",
      answer:
        "Chase ball of string eat plants, meow, and throw up because I ate plants going to catch the red dot today going to catch the red dot today. I could pee on this if I had the energy. Chew iPad power cord steal the warm chair right after you get up for purr for no reason leave hair everywhere, decide to want nothing to do with my owner today.",
    },
  ];

  return (
    <div className="faq-page">
      <div className="faq-header">
        <div className="faq-image">
          <img src="/images/faq.png" alt="FAQ Image" />
        </div>
        <div className="faq-content">
          <h1>Frequently Asked Questions</h1>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
