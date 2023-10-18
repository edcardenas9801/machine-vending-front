import React, {useEffect, useState} from 'react';
import Article from './Article';
import axiosInstance from "../services/MachineService";
import Swal from 'sweetalert2';

const Machine = () => {
    const initialStateCoins = {coin_1: 0, coin_025: 0, coin_010: 0, coin_005: 0};
    const [balance, setBalance] = useState(0);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [cancelPurchase, setCancelPurchase] = useState(false);
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [coins, setCoins] = useState(initialStateCoins);

    const insertCoin = (value) => {
        setBalance(balance + value);
        switch (value) {
            case 0.05:
                setCoins(prevState => ({
                    ...prevState,
                    coin_005: coins.coin_005++,
                }))
                break;
            case 0.10:
                setCoins(prevState => ({
                    ...prevState,
                    coin_010: coins.coin_010++,
                }))
                break;
            case 0.25:
                setCoins(prevState => ({
                    ...prevState,
                    coin_025: coins.coin_025++,
                }))
                break;
            case 1:
                setCoins(prevState => ({
                    ...prevState,
                    coin_1: coins.coin_1++,
                }))
                break;
            default:
                break;
        }
    };

    const returnCoins = () => {
        setBalance(0);
        setSelectedArticle(null);
        setCoins(initialStateCoins);
    };

    const selectArticle = (article) => {
        if (balance >= article.price) {
            Swal.fire({
                title: '',
                text: 'Are you sure you want to buy this product?',
                icon: 'warning',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    buyArticle(article);
                }
            });
        } else {
            Swal.fire('Error', 'Insufficient balance. Please insert more money.', 'error');
        }
    };

    const buyArticle = (article) => {
        setLoading(true);
        axiosInstance
            .post('api/buy-article', {
                productId: article.id,
                userBalance: balance,
                coins: coins
            })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire('Success',
                        'Your purchase has been successful, you have a change of $' + response.data.change.toFixed(2),
                        'success');
                    returnCoins();
                } else {
                    Swal.fire('Error', response.data.error, 'error');
                }
            })
            .catch(() => {
                Swal.fire('Error', 'Error purchasing the product', 'error');
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const renderArticleButtons = () => {
        return articles.map((a, index) => (
            <Article
                key={index}
                article={a}
                selectArticle={selectArticle}
                balance={balance}
                selectedArticle={selectedArticle}
            />
        ));
    };

    const getArticles = () => {
        setLoading(true);
        axiosInstance
            .get('api/get-articles')
            .then((response) => {
                setArticles(response.data.data);
            })
            .catch(() => {
                Swal.fire('Error', 'Error consulting the items on the vending machine', 'error');
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        getArticles();
    }, []);

    useEffect(() => {
        setCancelPurchase(balance > 0);
    }, [balance]);

    return (
        <div className="vending-machine mt-5">
            <div className="row mb-2">
                <h1>Vending Machine</h1>
            </div>
            {
                loading ?
                    <div>
                        <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <div>
                        <div className="row col-6 machine-container">{renderArticleButtons()}</div>
                        <div className="mt-3">
                            <h2>Balance: ${balance.toFixed(2)}</h2>
                            <div className="balance">
                                {cancelPurchase && (
                                    <button onClick={returnCoins} className={'btn btn-danger button-insert'}>
                                        Return Coins
                                    </button>
                                )}
                                <button onClick={() => insertCoin(0.05)} className={'btn btn-secondary button-insert'}>
                                    Insert $0.05
                                </button>
                                <button onClick={() => insertCoin(0.10)} className={'btn btn-secondary button-insert'}>
                                    Insert $0.10
                                </button>
                                <button onClick={() => insertCoin(0.25)} className={'btn btn-secondary button-insert'}>
                                    Insert $0.25
                                </button>
                                <button onClick={() => insertCoin(1)} className={'btn btn-secondary button-insert'}>
                                    Insert $1
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
};

export default Machine;