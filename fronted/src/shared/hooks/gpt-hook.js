import { useState } from "react"
import {useHttpClient} from "./http-hook"


export const useGpt = () => {
    const { sendRequest, error, isLoading, clearError } = useHttpClient()
    const [fetchedData, setFetchedData] = useState()

        async function generateCaptions(placeName) {
          const prompt = `Generate captions for a social media post about the place "${placeName} with an emoji, try to add some description about the place, the captions should be in first person speech, give 3 captions stored in an array closed with square braces":`;
            try {
                const response = await sendRequest(`${process.env.REACT_APP_CHATGPT_API_URL}/v1/completions`, 
                    'POST',
                    JSON.stringify({
                      'model': 'text-davinci-003',
                      'prompt': prompt,
                      'temperature': 0.7,
                      'max_tokens': 256,
                      'stop': [
                        'Human:',
                        'AI:'
                      ]
                    }),{
                      'Authorization': 'Bearer pk-FIrqBExccQGMKESddpMGaGiOafkvSYqBccLpxzEwiEhyKSri',
                      'Content-Type': 'application/json'
                    },
                  );
                  console.log(response)
                  setFetchedData(JSON.parse(response.choices[0].text))
            } catch {
            }
          }
    return(
        {
          fetchedData,
          isCaptionLoading: isLoading,
          CaptionError: error,
          clearCaptionError: clearError,
          generateCaptions
        }
    )
}


