import React, { useState, useRef } from 'react';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { imageToBase64 } from './utils';
import './App.css';
import signatureImage from './signature.png'; // Import the signature image

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const contentRef = useRef();

  const generatePDF = async () => {
    try {
      const dataUrl = await imageToBase64(signatureImage);
      const html = contentRef.current.innerHTML;
      const pdfContent = htmlToPdfmake(html);

      const documentDefinition = {
        content: pdfContent,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          subheader: {
            fontSize: 15,
            bold: true,
          },
          normal: {
            fontSize: 12,
          },
          signature: {
            margin: [0, 50, 0, 0],
          },
        },
        images: {
          signature: dataUrl,
        },
      };

      pdfContent.push({
        image: dataUrl,
        width: 200,
        alignment: 'left',
      });

      pdfContent.push({
        text: `Intern: ${name}`,
        style: 'normal',
      });

      pdfContent.push({
        text: `Date: \n`,
        style: 'normal',
      });

      pdfContent.push({
        text: `\nSignature:`,
        style: 'normal',
      });

      pdfMake.createPdf(documentDefinition).download(`${name} - Internship_Agreement.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Internship Contract Generator</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generatePDF();
        }}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Intern's Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Intern's Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Generate Contract
        </button>
      </form>

      <div ref={contentRef} className="hidden">
        <h1 className="header">Internship Agreement</h1>
        <p className="subheader">1. Parties:</p>
        <p className="normal">
          This Agreement is made between Ailurotech Solutions Pty Ltd, (hereinafter referred to as 'the Company') and <b>{name}</b>, (hereinafter referred to as 'the Intern'), residing at <b>{address}</b>.
        </p>
        <p className="subheader">2. Term of Internship:</p>
        <p className="normal">
          The internship will commence on <b>{startDate}</b> and conclude on <b>{endDate}</b>. The Intern agrees to commit to work for a minimum of 15 hours spread over at least 2 days each week during this period.
        </p>
        <p className="subheader">3. Nature of the Internship:</p>
        <p className="normal">
          This is an unpaid internship. The purpose of the internship is to provide the Intern with the opportunity to gain practical experience in a technology-oriented business environment. The Internship position is not entitled to wages or a promise of employment at the conclusion of the internship period.
        </p>
        <p className="subheader">4. Duties and Responsibilities:</p>
        <p className="normal">The Intern will engage in the following duties:</p>
        <ul className="normal">
          <li>Assist in the development and maintenance of websites.</li>
          <li>Collaborate with the team to design and implement new features and functionalities.</li>
          <li>Test and troubleshoot issues to ensure optimal performance and compliance with specifications.</li>
          <li>Participate in code reviews to maintain code quality and share knowledge.</li>
        </ul>
        <p className="subheader">5. Confidentiality:</p>
        <p className="normal">
          The Intern agrees to keep in strict confidence any and all confidential information disclosed to them during the course of the internship. Confidential information includes, but is not limited to, proprietary software, marketing strategies, operational processes, and client information.
        </p>
        <p className="subheader">6. Non-Competition:</p>
        <p className="normal">
          The Intern agrees not to engage in any work, paid or unpaid, that would create a conflict of interest with the Company. This includes refraining from assisting any company that is in direct competition with the business and interests of the Company, during the term of the internship and for [specify duration] after its conclusion.
        </p>
        <p className="subheader">7. General Provisions:</p>
        <ul className="normal">
          <li>This contract represents the entire agreement between the parties.</li>
          <li>The validity, interpretation, and enforcement of this contract will be governed by the laws of the jurisdiction in which the Company is located.</li>
          <li>Any amendments to this agreement must be in writing and signed by both parties.</li>
        </ul>
        <br />
        <p className="subheader">Signature:</p>
        <p className="normal">Max Zhuge<br />Position: CEO<br />Date: {new Date().toLocaleDateString()}</p>
        <p className="normal">Signature:</p>
      </div>
    </div>
  );
}

export default App;
