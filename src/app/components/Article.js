import React from 'react';

const Article = ({article, selectArticle, balance, selectedArticle}) => {
    return (
        <div className={'col-6 col-xs-12'}>
            <button
                className={'btn btn-default'}
                onClick={() => selectArticle(article)}
                disabled={balance < article.price || selectedArticle}
            >
                <img src={article.img} alt={`Image ${article.name}`} className={'img-article'}/>
                {article.name} (${article.price})
            </button>
        </div>
    );
};

export default Article;




