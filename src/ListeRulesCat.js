import React from 'react';

function ListeRulesCat(props) {
    return (
        <div>
            <div>
                <h2> Ce que je dois faire </h2>
                <p> {props.must}</p>
            </div>
            <div>
                <h2> Ce que je peux faire </h2>
                <p> {props.can}</p>
            </div>
            <div>
                <h2> Ce que je ne dois pas faire </h2>
                <p> {props.mustnot}</p>
            </div>
        </div>

    );

}

export default ListeRulesCat;