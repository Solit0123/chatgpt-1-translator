import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const textToTranslate = req.body.text || '';
  const one = req.body.one  || '';
  const two = req.body.two  || '';

  if (textToTranslate.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text to translate.",
      }
    });
    return;
  }
  
  // if (!one && !two) {
  //   res.status(400).json({
  //     error: {
  //       message: `Please enter at least one valid language: ${one} && ${two}`,
  //     }
  //   });
  //   return;
  // };



  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(textToTranslate, one),
      temperature: 0.6,
    });

    const completion2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt2(textToTranslate, two),
      temperature: 0.6,
    });


    res.status(200).json({ result: completion.data.choices[0].text , result2: completion2.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: `An error occurred during your request.${one} && ${two}`,
        }
      });
    }
  }
}

function generatePrompt(texttotranslate, one) {
  // const capitalizedText =
  // textToTranslate[0].toUpperCase() + animal.slice(1).toLowerCase();

  return `Translate the following text to ${one}. Write it in a way that a 3rd greater can understant it.

  Text:${texttotranslate}
`;
}

function generatePrompt2(texttotranslate, two) {
  // const capitalizedText =
  // textToTranslate[0].toUpperCase() + animal.slice(1).toLowerCase();

  return `Translate the following text to ${two}. Write it in a way that a 3rd greater can understant it.

  Text:${texttotranslate}
`;
}
