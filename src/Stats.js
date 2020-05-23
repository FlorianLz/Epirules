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
            setLoading(false);
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
                confirmes: data[i].Infection,
                morts: data[i].Deces,
                gueris: data[i].Guerisons
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
            <Line type="monotone" dataKey="confirmes" stroke="#8884d8" strokeWidth={3}/>
            <Line type="monotone" dataKey="morts" stroke="red" strokeWidth={3}/>
            <Line type="monotone" dataKey="gueris" stroke="#82ca9d" strokeWidth={3}/>
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
                confirmes: data[i].Confirmed,
                morts: data[i].Deaths,
                gueris: data[i].Recovered
            })
        }
        //console.log(history);
        setH(<LineChart width={400} height={300} data={history}>
            <XAxis dataKey="data"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="confirmes" stroke="#8884d8" strokeWidth={3}/>
            <Line type="monotone" dataKey="morts" stroke="red" strokeWidth={3}/>
            <Line type="monotone" dataKey="gueris" stroke="#82ca9d" strokeWidth={3}/>
        </LineChart>);
    }

    async function getPopulation(s,c,t){
        await axios.get('https://restcountries.eu/rest/v2/name/'+s).then(function (response) {
            let p = response.data[0].population;
            let percent = c*100/p;
            //console.log(percent)
            setPopulation('Population touchée : '+percent.toFixed(2)+'%');
        })
        //Pour le monde
        await axios.get('https://d6wn6bmjj722w.population.io/1.0/population/World/today-and-tomorrow/').then(function (response) {
            let mondiale = response.data.total_population[0].population;
            let percent = c*100/t;
            setPopulationGlobale('Population touchée : '+percent.toFixed(2)+'%');
        })
    }


    useEffect(()=>{
        getData(codepays);
    },[])


    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    if(loading === true){
        return (
            <div>
                <Header page={'Statistiques '+pays}> </Header>
                <div className="stats">
                    <div className="intro">
                        <h2>Ici vous pouvez retrouver les statistiques du pays que vous avez sélectionné</h2>
                    </div>
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
                <Header page={'Statistiques '+pays}> </Header>
                <div className="stats">
                    <div className="intro">
                        <h2>Ici vous pouvez retrouver les statistiques du pays que vous avez sélectionné</h2>
                    </div>
                    <p>Pays sélectionné : {pays}</p>
                    <p className={'pays'}>MAJ : {jsxDate}</p>
                    <p>Nombre de cas : {confirmed}</p>
                    <p>Nombre de morts : {deaths}</p>
                    <p>Nombre de guéris : {recovered}</p>
                    <p>{population}</p>
                </div>
                {h}
                <div className="stats">
                    <div className="intro">
                        <h2>Ici vous pouvez retrouver les statistiques globales de l'épidémie</h2>
                    </div>
                    <p>Monde</p>
                    <p className={'pays'}>MAJ : {jsxDateGlobal}</p>
                    <p>Nombre de cas : {globalConfirmed}</p>
                    <p>Nombre de morts : {globalDeaths}</p>
                    <p>Nombre de guéris : {globalRecovered}</p>
                    <p>{populationGlobale}</p>
                </div>
                {g}
            </div>

        );
    }

}