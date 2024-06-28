import React, { useEffect } from "react";

import Quagga from 'quagga';

import { Video } from "./styles";

import { validateIsbn } from "../../services/books";



function Main() {

  let scannerAttempts = 0;
  const onDetected = result => {
    Quagga.offDetected(onDetected);

    const isbn = result.codeResult.code;

    if (validateIsbn(isbn)) {
      alert(`ISBN VÁLIDO ${isbn}`);
      console.log("Validating ISBN:", isbn);
      return;
    }
    if (scannerAttempts >= 5) {
      console.log("Validating ISBN:", isbn);
      alert("Não é possivel ler o codigo do livro, por favor, tenta novamente.");
    } else {
      scannerAttempts += 1;
      Quagga.onDetected(onDetected);
    }
  };



  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#video'),
          constraints: {
            facilingMode: 'enviroment',
          },
        },
        numOfWorkers: 1,
        locate: true,
        decoder: {
          readers: ['ean_reader'],
        }
      }, err => {
        if (err) {
          console.log(err);
          alert("Erro ao abrir a camera do dispositivo, por favor, dê a permissão de uso.");
          return;
        }
        Quagga.start();
      },
        Quagga.onDetected(onDetected)

      );
    }
  }, []);

  return (
    <Video id="video" />
  );
}
export default Main; 