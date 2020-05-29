import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Stats() {
    const [cookies] = useCookies(['pays']);
    const [deaths,setDeaths] = useState('0');
    const [confirmed,setConfirmed] = useState('0');
    const [recovered,setRecovered] = useState('0');
    const [population,setPopulation] = useState('');
    const [populationGlobale,setPopulationGlobale] = useState('');
    const [globalDeaths,setGlobalDeaths] = useState('0');
    const [globalConfirmed,setGlobalConfirmed] = useState('0');
    const [globalRecovered,setGlobalRecovered] = useState('0');
    const [maj,setMaj] = useState('0');
    const [majGlobal,setMajGlobal] = useState('0');
    const [slug,setSlug] = useState('0');
    const [history,setHistory] = useState([]);
    const [h,setH] = useState([]);
    const [global,setGlobal] = useState([]);
    const [g,setG] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ici1,setIci1] = useState('Ici vous pouvez retrouver les statistiques du pays que vous avez sélectionné');
    const [ici2,setIci2] = useState('Ici vous pouvez retrouver les statistiques globales de l\'épidémie');
    const [msgCas,setMsgCas] = useState('Nombre de cas');
    const [msgDeces,setMsgDeces] = useState('Nombre de morts');
    const [msgGueris,setMsgGueris] = useState('Nombre de guéris');
    const [popTouchee,setPopTouchee] = useState('Population touchée');
    const [paysSelectionne,setPaysSelectionne] = useState('Pays sélectionné');
    const [monde,setMonde] = useState('Monde');
    const [nomPage,setNomPage] = useState('');

    let pays=cookies.pays;
    let codepays=cookies.codepays;

    let thedate=new Date (maj);
    let day=thedate.getDate();
    let month=thedate.getMonth()+1;
    let hours = thedate.getHours();
    let minutes = thedate.getMinutes();
    if(month<10){
        month='0'+month;
    }
    if(day<10){
        day='0'+day;
    }
    if(hours<10){
        hours='0'+hours;
    }
    if(minutes<10){
        minutes='0'+minutes;
    }

    let jsxDate = day + '/'+ month + '/' +thedate.getFullYear()+ ' - '+ hours +'h'+ minutes;

    let thedateglobal=new Date (majGlobal);
    let dayGlobal=thedate.getDate();
    let monthGlobal=thedate.getMonth()+1;
    let hoursGlobal = thedate.getHours();
    let minutesGlobal = thedate.getMinutes();
    if(monthGlobal<10){
        monthGlobal='0'+monthGlobal;
    }
    if(dayGlobal<10){
        dayGlobal='0'+dayGlobal;
    }
    if(hoursGlobal<10){
        hoursGlobal='0'+hoursGlobal;
    }
    if(minutesGlobal<10){
        minutesGlobal='0'+minutesGlobal;
    }

    let jsxDateGlobal = dayGlobal + '/'+ monthGlobal + '/' +thedateglobal.getFullYear()+ ' - '+ hoursGlobal +'h'+ minutesGlobal;

    async function getData(codepays){
        await axios.get('https://api.covid19api.com/summary').then(function (response) {
            //console.log(response.data);
            const data=response.data;
            for(let i =0; i<data.Countries.length;i++){
                if (data.Countries[i].CountryCode === codepays){
                    //console.log(data.Countries[i]);
                    setConfirmed(data.Countries[i].TotalConfirmed + ' (➚'+data.Countries[i].NewConfirmed+')');
                    setDeaths(data.Countries[i].TotalDeaths + ' (➚'+data.Countries[i].NewDeaths+')');
                    setRecovered(data.Countries[i].TotalRecovered + ' (➚'+data.Countries[i].NewRecovered+')');
                    setGlobalConfirmed(data.Global.TotalConfirmed + ' (➚'+data.Global.NewConfirmed+')');
                    setGlobalDeaths(data.Global.TotalDeaths + ' (➚'+data.Global.NewDeaths+')');
                    setGlobalRecovered(data.Global.TotalRecovered + ' (➚'+data.Global.NewRecovered+')');
                    setMaj(data.Countries[i].Date);
                    setMajGlobal(data.Date);
                    setSlug(data.Countries[i].Slug);
                    getHistory(data.Countries[i].Slug);
                    getGlobal();
                    getPopulation(data.Countries[i].Slug,data.Countries[i].TotalConfirmed,data.Global.TotalConfirmed);
                }
            }
            let langue=navigator.language.split('-')[0];
            let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
            if(langue !== 'fr'){
                async function translate() {
                    let states = ['Statistiques',ici1,ici2,msgCas,msgDeces,msgGueris,popTouchee,paysSelectionne,monde];
                    let set = [setNomPage,setIci1,setIci2,setMsgCas,setMsgDeces,setMsgGueris,setPopTouchee,setPaysSelectionne,setMonde];

                    for(let i=0; i<states.length; i++){
                        await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                            set[i](response.data.text)
                        })
                    }
                }
                translate().then(()=>setLoading(false)).catch(function (errors) {
                    setNomPage('Statistiques')
                    setLoading(false)
                })
            }else{
                setNomPage('Statistiques')
                setLoading(false)
            }
        }).catch(function (erreur) {
            if(erreur){
                getData(codepays)
            }
        })
    }

    async function getGlobal(){
        const data = (await axios.get('https://cors-anywhere.herokuapp.com/https://www.data.gouv.fr/fr/datasets/r/a7596877-d7c3-4da6-99c1-2f52d418e881')).data.GlobalData;
        for(let i =0; i<data.length;i++){
            let date = new Date (data[i].Date);
            let day=date.getDate();
            let month=date.getMonth()+1;
            if(month<10){
                month='0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            global.push({
                data: day + '/'+ month+ '/' +date.getFullYear(),
                Confirmés: data[i].Infection,
                Décédés: data[i].Deces,
                Guéris: data[i].Guerisons
            })
        }
        global.reverse();
        //console.log(global);
        setG(<LineChart width={400} height={300} data={global}>
            <XAxis dataKey="data"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="Confirmés" stroke="#8884d8" strokeWidth={3}/>
            <Line type="monotone" dataKey="Décédés" stroke="red" strokeWidth={3}/>
            <Line type="monotone" dataKey="Guéris" stroke="#82ca9d" strokeWidth={3}/>
        </LineChart>);
    }

    async function getHistory(slug){
        const data = (await axios.get('https://api.covid19api.com/total/country/'+slug)).data;
        for(let i =0; i<data.length;i++){
            let date = new Date (data[i].Date);
            let day=date.getDate();
            let month=date.getMonth()+1;
            if(month<10){
                month='0'+month;
            }
            if(day<10){
                day='0'+day;
            }
            history.push({
                data: day + '/'+ month+ '/' +date.getFullYear(),
                Confirmés: data[i].Confirmed,
                Décédés: data[i].Deaths,
                Guéris: data[i].Recovered
            })
        }
        //console.log(history);
        setH(<LineChart width={400} height={300} data={history}>
            <XAxis dataKey="data"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="Confirmés" stroke="#8884d8" strokeWidth={3}/>
            <Line type="monotone" dataKey="Décédés" stroke="red" strokeWidth={3}/>
            <Line type="monotone" dataKey="Guéris" stroke="#82ca9d" strokeWidth={3}/>
        </LineChart>);
    }

    async function getPopulation(s,c,t){
        await axios.get('https://restcountries.eu/rest/v2/name/'+s).then(function (response) {
            let p = response.data[0].population;
            let percent = c*100/p;
            //console.log(percent)
            setPopulation(percent.toFixed(2)+'%');
        });
        //Pour le monde
        await axios.get('https://d6wn6bmjj722w.population.io/1.0/population/World/today-and-tomorrow/').then(function (response) {
            let mondiale = response.data.total_population[0].population;
            let percent = t*100/mondiale;
            setPopulationGlobale(percent.toFixed(2)+'%');
        })
    }


    useEffect(()=>{
        getData(codepays);
    },[]);


    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    if(loading === true){
        return (
            <div>
                <Header page={nomPage}> </Header>
                <div className="stats">
                    <div className="lds-roller">
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                    </div>
                </div>
            </div>

        );
    }else{
        return (
            <div className={'globalstats'}>
                <Header page={nomPage}> </Header>
                <div className="stats">
                    <div className="intro">
                        <h2>{ici1}</h2>
                    </div>
                    <p>{paysSelectionne} : {pays}</p>
                    <p className={'pays'}>{jsxDate}</p>
                    <p>{msgCas} : {confirmed}</p>
                    <p>{msgDeces} : {deaths}</p>
                    <p>{msgGueris} : {recovered}</p>
                    <p>{popTouchee} : {population}</p>
                </div>
                {h}
                <div className="stats">
                    <div className="intro">
                        <h2>{ici2}</h2>
                    </div>
                    <p>{monde}</p>
                    <p className={'pays'}>{jsxDateGlobal}</p>
                    <p>{msgCas} : {globalConfirmed}</p>
                    <p>{msgDeces} : {globalDeaths}</p>
                    <p>{msgGueris} : {globalRecovered}</p>
                    <p>{popTouchee} : {populationGlobale}</p>
                </div>
                {g}
            </div>

        );
    }

}