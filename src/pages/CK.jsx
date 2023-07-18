
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import htmlToPdfmake from "html-to-pdfmake"
import pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import pdfFonts from "pdfmake/build/vfs_fonts";
import Nav from './Nav';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

var s='span'
export default function CK() {
  const [data, setData] = useState('')
  const [subject, setSubject] = useState('')
  

  // generate applcation
  const api_key = process.env.REACT_APP_API_KEY
  function generateApplication() {
    const headers = {
      'Authorization': `Bearer ${api_key}`,
      'Content-Type': 'application/json'
    };

    // Set the data
    const data2 = {
      model: 'text-davinci-003',
      prompt: subject,
      max_tokens: 300
    };

    // Make the Axios POST request
    axios.post('https://api.openai.com/v1/completions', data2, { headers })
      .then(response => {
        // Handle the response
        const newData = response.data.choices[0].text
        const apiData = JSON.stringify(newData)
        console.log(apiData)
        const lines = apiData.split('\\n');
        const totoalData = lines.map(line =>`<p>${line}</p>`)
        const actual = totoalData.join('')
        
        console.log(lines)
        setData(actual)
      })
      .catch(error => {
        // Handle the error
        console.error(error);
      });
  }

  const editorRef = useRef("null");
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const htmlContent = data;
  const replcedData =  htmlContent.replace('&nbsp;','&emsp;')
  const pdfMakeContent = htmlToPdfmake(htmlContent);
  const generatePDF = async () => {
    
    const documentDefinition = {
      
      content: pdfMakeContent,
    }

    
    pdfMake.createPdf(documentDefinition).download('myPDF.pdf');
  };
  
  function changeContent(content){
    setData(content)
  }
  const changeEditorContent = () => {
    const newContent = 'New content';
    editorRef.current.setContent(newContent);
  };
  
   var conf =
    {
      height: 500,
      menubar: false,
      forced_root_block:'p',
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount','indent'
      ],
      
      toolbar: 'undo redo | blocks | ' +
        'bold italic  | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' ,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      
      
    }
  
  return (
    <>
    <Nav/>
      <div className="container text-center mt-5">
        <h3>Welcome to ApplicationWriter</h3>
        <div className="container ">
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '45ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField onChange={ev=>setSubject(ev.target.value)} id="outlined-basic" label="Write your subject" variant="outlined" />
          </Box>
          <button className='btn btn-primary' onClick={generateApplication}>Generate</button>
        </div>
        <Editor className='mt-4'
         
         apiKey='9v8us09pxz2l5kttnkz0wrdn1rq2903m9emcx2gsj85d7d26'
         onInit={(evt, editor) => editorRef.current = editor}
         
         initialValue="Hi"
         onEditorChange={changeContent}
         
         value={data}
         init={conf}
       />
        
        <button onClick={generatePDF} className='btn btn-primary mt-2 mb-3'>Download PDF</button>
      <div className=''>To give indentaion type space</div>
      <div className=''>Make neccessary changes</div>
      <p>Created by Kishar</p>
      </div>
 
    </>
  );
}