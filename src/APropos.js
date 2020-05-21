import React from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function APropos(props) {
    const [cookies] = useCookies(['pays']);

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'À propos de nous'}></Header>
            <div className="apropos">
                <div>
                    <h1>The internationals & InProgress Teams</h1>
                    <p>
                        First, The Internationales is a group of international students who are participating in the BUSIT week. The subject is "Design and create an innovative mobile application useful during a massive virus outbreak." and mixt different nationality : Belgian, French, Spanish, Finnish and Irish people.
                        It has come to our attention that nobody really knows what the rules are during an epidemic and if we enter a new phase it is often not really clear what the new rules have become.
                        With this app we hope to clear up any misunderstandings about the rules and make the world a safer place.

                        After this week, with a French team, we have to develop this application and create a communication campaign.

                    </p>
                </div>

                <div className="personnes">
                    <div className="personnes_left">
                        Idea of : <br />
                        Achacortabarria Andoni <br />
                        Van Tilborgh Liam <br />
                        Paluch Loïc <br />
                        Hendrickx Luka <br />
                        Vittu Lydie <br />
                        Troumelen Morgane <br />
                    </div>
                    <div className="personnes_right">
                        Developt by : <br />
                        Paluch Loïc <br />
                        Vittu Lydie <br />
                        Troumelen Morgane <br />
                        Laignez Florian <br />
                        Tournemaine Tiphaine
                    </div>
                </div>
            </div>
        </div>

    );

}