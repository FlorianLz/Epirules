import React from 'react';
import Header from "./Header";
import {useCookies} from "react-cookie";
import {Redirect} from "react-router-dom";

export default function Urgences() {
    const [cookies] = useCookies(['pays']);
    let pays=cookies.pays;

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'Urgences '+pays}> </Header>
            <div className="emergency">
                <div className="partEmergency">
                    <div className="numero">
                        <a href="tel:+15">
                            <p> 15 </p>
                        </a>
                    </div>
                    <div className="nameNumero">
                        <p> SAMU </p>
                    </div>
                </div>

                <div className="partEmergency">
                    <div className="numero">
                        <a href="tel:+17">
                            <p> 17 </p>
                        </a>
                    </div>
                    <div className="nameNumero">
                        <p> Police </p>
                    </div>
                </div>

                <div className="partEmergency">
                    <div className="numero">
                        <a href="tel:+18">
                            <p> 18 </p>
                        </a>
                    </div>
                    <div className="nameNumero">
                        <p> Pompier </p>
                    </div>
                </div>

                <div className="partEmergency">
                    <div className="numero">
                        <a href="tel:+112">
                            <p> 112 </p>
                        </a>
                    </div>
                    <div className="nameNumero">
                        <p> Numéro Européen </p>
                    </div>
                </div>

                <div className="partEmergency">
                    <div className="numero">
                        <a href="tel:+144">
                            <p> 144 </p>
                        </a>
                    </div>
                    <div className="nameNumero">
                        <p> Urgences pour les sourds et malentendants </p>
                    </div>
                </div>

            </div>
        </div>
    );

}