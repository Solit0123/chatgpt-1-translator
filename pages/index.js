import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import Select from 'react-select';


export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();
  const [result2, setResult2] = useState();
  const [lng1, setLng1] = useState(false);
  const [lng2, setLng2] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    // alert(`this is the data from text: ${textInput} && ${lng1.value} && ${lng2.value}`)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput,
                                 one: lng1.value,
                                  two: lng2.value}),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setResult2(data.result2)
      setTextInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const handleSelectChange1 = (v) => {
   
    setLng1(v);
    console.log(lng1)
  };

  
  const handleSelectChange2 = (v) => {
    setLng2(v);
    console.log(lng2)
  };


  const languageOptions = [
    { value: '????', label: 'Select' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    {value: 'German', label: 'German'},
    {value: 'Chinese', label: 'Chinese'},
    {value: 'Tagalog', label: 'Tagalog'},
    {value: 'Korean', label: 'Korean'},
    {value: 'Vietnamese', label: 'Vietnamese'},
    { value: 'Russian', label: 'Russian' },

  ]

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main} style={{textAlign: "center"}}>
        <img src="/dog.png" className={styles.icon} />
        <h1>Translate to two languages at the same time.</h1>
        <h2>The language model will automatically detect your language.</h2>
        <h3>Just start typing and select your desired languages.</h3>
        <h4>TRANSLATE TO <span style={{fontWeight: "normal"}}>{lng1?.label != "Select" && lng1?.label ? lng1?.label :  "_____"}</span> & <span style={{fontWeight: "normal"}}>{lng2?.label != "Select" && lng2?.label ? lng2?.label :  "_____"}</span></h4>
        <form onSubmit={onSubmit} >
          <div className="" style={{display: "flex", flexDirection: "row", justifyContent: "space-between", margin: "3rem 0px "}}>
          <div>
            <label htmlFor="selectInput1">Select an option:</label>
              <Select id="selectInput1" options={languageOptions} value={lng1} onChange={handleSelectChange1} />
           
              </div>  
              <div>
              <label htmlFor="selectInput2">Select an option:</label>
            <Select id="selectInput2" options={languageOptions} value={lng2} onChange={handleSelectChange2} />
       
              </div>

          </div>
            
              
               <textarea
               style={{display: "block", minHeight: "200px", marginBottom: "1rem"}}
            type="text"
            name="animal"
            placeholder="Enter a TEXT to translate. (The language model will automatically detect your language.)"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input type="submit" value="TRANSLATE" />
        </form>

        <div className="">
{/* loading state circle loading or real time text based? */}

        </div>
        {lng1 && result && ( <div className={styles.result} style={{border: "solid black 1px", padding: '1rem'}}><h3 style={{lineHeight: "50%"}}>{lng1?.label}: </h3><br/>{result}</div>)}
        {lng2 && result2 && ( <div className={styles.result} style={{border: "solid black 1px", padding: '1rem'}}><h3 style={{lineHeight: "50%"}}>{lng2?.label}: </h3><br/>{result2}</div>)}
       
      </main>
    </div>
  );
}
