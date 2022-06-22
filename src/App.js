import React from "react";
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import LoginDialog from './Components/LoginDialog';
import { Pie } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { chartColors } from "./colors";
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";
import Link from '@mui/material/Link';
import { textAlign } from "@mui/system";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdvancedChart } from "react-tradingview-embed";

class App extends React.Component {
  // Constructor 
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      DataisLoaded: false,
      stocks: [],
      text: "",
      myKey: "",
      filterSector: "",
      filterIndustry: "",
      symbol: ""
    };
  }

  // ComponentDidMount is used to
  // execute the code 
  componentDidMount() {
    fetch(
      "https://www.forexsignals10pips.com/stockscreener/staticapi.php?data=screeners")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          ...this.state,
          items: json,
          DataisLoaded: true,
          stocks: [],
          selectedValue: 1,
          open: false,
          myKey: localStorage.getItem("key")
        });
      })
  }

  loadScreener = (key) => {
    const id = key.currentTarget.id;
    const innerText = key.currentTarget.innerText;
    if (this.state.myKey == "" || this.state.myKey == null) {
      this.notifyError("You must be registered to our system")();
    } else {
      fetch(
        "https://www.forexsignals10pips.com/stockscreener/api.php?key=" + this.state.myKey + "&screen=" + id + "&format=JSON")
        .then((res) => res.json())
        .then((json) => {
          if (json.response === '300') {
            this.notifyError("User not logged in")();
            this.setState({
              ...this.state,
              myKey: null,
              symbol: ""
            });
          } else {
            this.setState({
              ...this.state,
              items: this.state.items,
              DataisLoaded: this.state.DataisLoaded,
              stocks: json,
              text: innerText,
              symbol: ""
            });
          }
        })
    }


  }

  notifyError = (message) => () => toast.error(message);

  notifyOk = (message) => () => toast.success(message);

  handleDisconnect = () => () => {
    this.setState({
      ...this.state,
      myKey: null
    })
  }

  onClickFilterSector = (sector) => () => {
    this.setState({
      ...this.state,
      filterSector: sector,
      symbol: ""
    })
  }

  onClickFilterIndustry = (industry) => () => {
    this.setState({
      ...this.state,
      filterIndustry: industry,
      symbol: "",
    })
  }

  clickUser = () => {
    this.setState({
      ...this.state,
      open: true
    })
  }

  handleClose = (data) => {
    if (data && data != "") {
      localStorage.setItem("key", data);
      this.setState({
        ...this.state,
        myKey: data
      })
    }

  }

  setSimbol = (ticker) => () => {
    this.setState({
      ...this.state,
      symbol: ticker
    })
  }

  render() {
    const { DataisLoaded, items, stocks, text, myKey } = this.state;
    if (!DataisLoaded) return <div>
      <h1> Pleses wait some time.... </h1> </div>;

    const divStyle = {
      height: "32px",
    };
    let showchart = false;
    const stockData = [];
    const stockDataValues = [];
    const stockDataKeys = [];
    if (stocks.length > 0) {
      showchart = true;
      stocks.forEach(stock => {
        let keyArray = stock.Sector;
        if (this.state.filterSector != "") {
          keyArray = stock.Industry;
        }

        if (this.state.filterSector !== "" && this.state.filterSector != stock.Sector) {
          return
        }
        if (stockData[keyArray]) {
          stockData[keyArray]++;
        } else if (keyArray) {
          stockData[keyArray] = 1;
        }
      });

      // Here all the elements of the array is being printed.
      for (let key in stockData) {
        stockDataKeys.push(key);
        stockDataValues.push(stockData[key]);
      }
    }
    const data = {
      labels: stockDataKeys,
      datasets: [
        {
          label: '# of Votes',
          data: stockDataValues,
          backgroundColor: chartColors,
          borderColor: chartColors,
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="App">
        <div style={divStyle}>
          <LoginDialog handleDisconnect={this.handleDisconnect()} myKey={myKey ? myKey.substring(0, 4) + "..." : ""} onClose={this.handleClose} notifyOk={this.notifyOk('Registered')} notifyError={this.notifyError('User already exists')}></LoginDialog>


        </div>
        <header className="App-header">

          <img src={logo} className="App-logo" alt="logo" onClick={this.loadScreener} />
          <h1>Stock Screener</h1>
          <p>
            Find the top performance stocks or the ones you like to trade very fast
          </p>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </header>
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 d-none d-md-block bg-light sidebar">
                <h3 style={{ marginTop: "35px" }}> Available Screeners </h3>
                <div className="sidebar-sticky">
                  <ul className="nav flex-column">
                    {
                      items.map((item) => (
                        <li key={"K" + item.key}>
                          <a className="nav-link" id={item.key} key={item.key} onClick={this.loadScreener} style={{ textAlign: "left", cursor: "pointer" }}>
                            Screener {item.Name}
                          </a>
                        </li>
                      ))
                    }
                  </ul>
                </div>

              </div>
              <div className="col-md-8 ml-sm-auto col-lg-9 pt-3 px-4">
                {text === "" &&
                  <div>
                    <h3>What will I have here?</h3>
                    <p>In this page you will find several already prepared screeners to filter the best performance stocks for your investment profile. You just have to filter in the available screeners
                      and the page will give you the best stocks. You just have to analize them and choose the ones you like for your investment.
                    </p>
                    <h3>Is this service free?</h3>
                    <p>
                      Now this service is free to get the first two options, but you can suscribe to our service by 1$ to get all the options available and all the screeners. At the bottom of the page you can subscribe by credit card or paypal.
                    </p>
                    <h3>Why I have to pay for this service?</h3>
                    <p>
                      We will use your payments to improve this page and the screeners. If you think that our service can save you a lot of time identifying the best performance stocks and sectors.
                      At the bottom of the page you can subscribe by credit card or paypal.
                    </p>
                    <h3>Can I have my own screener?</h3>
                    <p>
                      We already know that there are a lot of pages like ours in the world. There are a lot of screening pages where you can do your screener. But if you think that there is an screener that
                      can be very interesting we are always listening to your opinion.
                    </p>
                    <h3>I can't see the screener results</h3>
                    <p>
                      In order to limit the usage of our servers we need everyone who uses our service to be registered and logged in. We only require an e-mail and a password. No mail will be sent to you
                      and no other usages will have your mail. Just to identify you in our page. You can sing up and sing in using the person logo at the top right.
                    </p>
                  
                  </div>
                }
                {text &&
                  <div>
                    <h1> {text} </h1>
                    {showchart && this.state.symbol=="" && <MDBContainer>
                      <Pie data={data}
                        style={{ maxHeight: '300px' }}
                      />
                    </MDBContainer>
                    }
                    <center>
                    { this.state.symbol && 
                      <div>
                        <AdvancedChart widgetPropsAny ={{"range":"12M", "theme": "dark", "symbol": this.state.symbol, "width":"100%", "height" : "400px", "allow_symbol_change": false}} />
                        <br/>
                        </div>
                        }
                      {showchart &&
                      <div>

                        <table>
                          <thead>
                            <tr className="background-grey">
                              <td className="background-grey">Ticker</td>
                              <td className="background-grey">Name</td>
                              <td className="background-grey">
                                {this.state.filterSector !== "" ? <Link href="#" variant="body2" onClick={this.onClickFilterSector("")}>Sector</Link> : "Sector"}</td>
                              <td className="background-grey" >
                                {this.state.filterIndustry !== "" ? <Link href="#" variant="body2" onClick={this.onClickFilterIndustry("")}>Industry</Link> : "Industry"}
                              </td>
                              <td className="background-grey" >Last</td>
                              <td className="background-grey" >Change</td>
                              <td className="background-grey" >Volume</td>
                            </tr>
                          </thead>
                          <tbody>
                            {stocks.map((stock) => {
                              return ((this.state.filterSector == "" || stock.Sector == this.state.filterSector) && (this.state.filterIndustry == "" || stock.Industry == this.state.filterIndustry) ?
                                <tr>
                                  <td><Link href="#" variant="body2" onClick={this.setSimbol(stock.Symbol)}>{stock.Symbol}</Link></td>
                                  <td>{stock.Name}{this.state.filterSector}</td>
                                  <td><Link href="#" variant="body2" onClick={this.onClickFilterSector(stock.Sector)}>{stock.Sector}</Link></td>
                                  <td><Link href="#" variant="body2" onClick={this.onClickFilterIndustry(stock.Industry)}>{stock.Industry}</Link></td>
                                  <td>{stock.Last}</td>
                                  <td style={{ color: stock.Change.indexOf("-") != 0 ? 'green' : 'red' }}>{stock.Change}%</td>
                                  <td>{stock.Volume}</td>
                                </tr> : ""
                              )
                            }
                            )
                            }
                          </tbody>
                        </table>
                        </div>
                      }
                      {!showchart && <div>No tickers found today in this screener</div>}
                    </center>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default App;
