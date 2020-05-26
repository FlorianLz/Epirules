import React from 'react';

function ListeCategoriesAdd(props) {
    return (
        <div className="lineCategorie">
            <p>{props.name}</p>
            <div className="suppr">
                <p><i className="fas fa-times" data-suppr={props.suppr} onClick={props.onSuppr}> </i> </p>
            </div>
        </div>

    );

}

export default ListeCategoriesAdd;