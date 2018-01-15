import React, { Component } from 'react';
import './NewsFeed.css';

class NewsFeed extends Component {

  constructor(){
    super();
    this.state = {
        posts: []
    };
  }

  componentDidMount(){
    this.setState(Object.assign({}, this.state, {
        posts: [
        {
            id: 5,
            headline: "Närliggande lekplatser och radie",
            created: new Date(1515075266000).getTime(),
            author: "Mikael",
            message: `Denna kväll har lett till features som att man kan välja att expandera sitt resultatset med en dropdown-knapp uppe i högra hörnet.
            Sen har jag återanvänt det resultat-set som renderas på home till sidorna som visar specifika lekplatser. Det för att visa närliggande platser när man väl är inne på en specifik.
            Nästa steg blir att generera en karta istället för en lista med entries med samma funktionalitet.
            Därefter kommer vanliga användare få lite kärlek genom att kunna skicka in förslag och förändringar på lekplatser.`
        },
        {
            id: 4,
            headline: "Veckans features",
            created: new Date(1515045266000).getTime(),
            author: "Mikael",
            message: `Features som lagts till nyligen tillhör att kunna ge länkar
                       till städer och orter direkt genom att använda urlen. Till exempel https://lekplatserna.se/karlshamn skulle rendera lekplatserna i karlshamn direkt medan en tom url http:/lekplatserna.se skulle använda enhetens plats som standard.
                       Dessutom har jag lagt till detta statiska nyhetsflöde som förberedelse inför när jag lagt till backendstöd för det.`,
        },
        {
            id: 3,
            headline: "Sätra tillagd som första del i Gävle!",
            created: new Date(1514000200000).getTime(),
            author: "Mikael",
            message: "Med släkt och vänner i Sätra blev sätra i Gävle en naturlig nästa region att lägga till. Med detta får lekplatserna.se ytterligare några testare! Välkomna till er säger vi. Det finns fortfarande behov av att lägga till en del info om lekplatserna då Gävle kommun inte direkt ger några detaljer. Se https://lekplatserna.se/sätra",
        },
        {
            id: 2,
            headline: "Facebook-autentisering!",
            created: new Date(1512400200000).getTime(),
            author: "Mikael",
            message: "Facebook-autentisering är under utveckling och finns som en login-knapp i övre högre hörnet. Om man är intresserad av att bli testare på den här siten eller bara känner att det saknas lekplatser kan man höra av sig till mig på ostberg(punkt)mikael(snabela)gmail(punkt)com så lägger jag till dem i nuläget. Det kan vara värt att påminna om att den här appen/siten är under kontinuerlig utveckling. Många saker kan därav komma att förändras med tiden. "
        },
        {
            id: 1,
            headline: "Karlshamn kommun tillagd som första kompletta kommun!",
            created: new Date(1510400200000).getTime(),
            author: "Mikael",
            message: "Karlshamn kommun är första kommunen att få varje lekplats som kommunen har i sin ägo listad på lekplatserna.se"
        }]
    }));
  }

  render() {
    return (
        <div className="NewsFeed">
            {
                (this.state.posts.slice(0, 10).map(p => (
                    <a key={p.id} href={"/news/" + p.id}>
                        <label>
                            <div className="NewsFeed-Post">
                                <h2 className="NewsFeed-Post-Header">{p.headline}</h2>
                                <p className="NewsFeed-Post-Content">{p.message}</p>
                                <br/>
                                <div className="NewsFeed-Post-Created">{new Date(p.created).toLocaleString()}</div>
                                <div className="NewsFeed-Post-Author">{p.author}</div>
                                <br/>
                            </div>
                        </label>
                    </a>
                )))
            }
        </div>
    );
  }
}

export default NewsFeed;
