import React, { Component } from 'react';
import ReactDOM         from 'react-dom';
import GitHubForkRibbon from 'react-github-fork-ribbon';
import './About.css';

class About extends Component {

  render() {
    return (
      <div className="About">
            <GitHubForkRibbon
                    href="https://github.com/O5ten/lekplatserna"
                    target="_blank"
                    color="black"
                    position="right-bottom">
                    Fork me on GitHub
            </GitHubForkRibbon>
          <h1 className="About-Header">Om Lekplatserna.se</h1>
          <p>
            Idén till Lekplatserna.se kom utifrån en resa till Umeå stad 2015. Vår familj hade aldrig varit i Umeå förut och hade en tvååring med spring i benen med oss.
            Så med det i åtanke försökte vi förjäves ta reda på vart närmaste lekplatserna låg. Och Umeå kommuns hemsida var inte direkt till hjälp med detta.
            Det var i princip helt omöjligt att ta reda på vart några eventuella större lekplatser skulle vara under stress. Och maps märker ut parker, men inte nödvändigtvis lekparker.
            Det var ännu svårare att veta vad som skulle finnas på plats eller hur nära vår position det låg.
          </p>
          <p>
            Så, eftersom jag är utvecklare till yrket så tänkte jag att det finns ett behov av att skapa ett register med lekplatser som uppdateras och bibehålls
            av de människor som besöker dem. Vi föräldrar alltså. Och den här siten är resultatet av det behovet. Att kunna hitta lekplatser baserat på enhetens position är huvudsyftet.
            I förlängningen ser jag helst att kommunerna uppdaterar direkt på lekplatserna.se på egen hand då de sitter på informationen om vilka lekplatser som finns.
            Men i dagsläget får vi vara nöjda med att lekplatser läggs till av min själv och en tunn användarbas som har den rättigheten.
            I förlängningen tänker jag utöka med en möjlighet att kommentera och felamnäla lekplarker.
          </p>
          <p>
            Rent tekniskt bygger sidan på React till frontend och Kotlin samt SparkJava i sin Backend, och började som ett projekt för mig att applicera en utvecklingsteknik som heter continuous deployment.
            Det vill säga alla förändringar som sker i källkoden åker ut på sidan så fort det händer. Och om man är tekniskt lagd får man gärna kommentera eller skapa issues på GitHub där källkoden ligger öppet och tillgänglig för alla.
          </p>
          <p>
            Om det finns behov av att komma i kontakt med mig eller om man vill bli testare kan man skicka ett mail till ostberg(punkt)mikael(snabela)gmail(punkt)com
          </p>
      </div>
    );
  }
}

export default About;
