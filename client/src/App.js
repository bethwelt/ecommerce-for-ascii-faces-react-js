import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './Styles.css';

class App extends Component {
  constructor(props) {
    super(props);

    // Sets up our initial state
    this.state = {
      error: false,
      hasMore: true,
      limit:24,
      isLoading: false,
      products:[],
      ads:20,
      page:1,
    };

    // Binds our scroll event handler
    window.onscroll = () => {
      const {
        loadProducts,
        state: {
          error,
          isLoading,
          hasMore,
          
        },
      } = this;

  //check if the user reached the bottom of apage..
      if (error || isLoading || !hasMore) return;
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)  {
        //increment page number by 1.
        this.setState({ page: this.state.page+1 });
        //load more products based on the limit assign and page.
        loadProducts();

      }
    };
  }

  componentWillMount() {
    this.loadProducts();
  }

  loadProducts = () => { 
    //get page number and assign the limite
    const page = this.state.page;
    const limit = this.state.limit;
      //generate ads randomly
    const rand = Math.floor(Math.random()*1000);
    let url =`http://localhost:3000/ads/?r=${rand}`;
    //insert ad to the product list at position 20 automatically
    this.state.products.splice(this.state.ads,0,{id:Math.floor(Math.random()*1000),img:url,date: new Date()})
    //call the api  and set state white pushing the new array to the list
    this.setState({ isLoading: true }, () => {
      fetch(`http://localhost:3000/products?_page=${page}&_limit=${limit}`)
      .then(res => res.json())
      .then(result =>
        this.setState({ 
           products:this.state.products.concat(result),
            hasMore: (this.state.products.length < this.state.products.concat(result).length),
            ads: this.state.ads+20,
            isLoading: false,
            total:this.state.products.length+limit,
          }));
       });

     
  }
  

 SortProducts = (event) => {
  
  //Get sort parameter price,id,size
    const sort = event.target.value;

    //set or refresh the array
    this.setState({ products:[]});
    //generate ads randomly
    const rand = Math.floor(Math.random()*1000);
    let url =`http://localhost:3000/ads/?r=${rand}`;
    //insert ad to the product list at position 20 automatically
    this.state.products.splice(this.state.ads,0,{id:Math.floor(Math.random()*1000), img:url, date: new Date()})
    this.setState({ isLoading: true }, () => {
      //fetch sorted array
      fetch(`http://localhost:3000/products?_sort=${sort}`)
      .then(res => res.json())
      .then(result =>
        this.setState({ 
          //set state of new array.and set loader to false.
           products:this.state.products.concat(result),
            isLoading: false,
          }));
     });
  

  };

  ConvertDate =(dates)=>{
    //console.log(new Date());
    //convert product date time to string 
    let date =new Date(dates);
    let month =("0"+(date.getMonth()+1)).slice(-2);
    let day =("0"+(date.getDate())).slice(-2);
    let hours =("0"+(date.getHours())).slice(-2);
    let min =("0"+(date.getMinutes())).slice(-2);
    let sec =("0"+(date.getSeconds())).slice(-2);

    //convert current date time to string 

    var date1 =new Date(new Date());
    let month1 =("0"+(date1.getMonth()+1)).slice(-2);
    let day1 =("0"+(date1.getDate())).slice(-2);
    let hours1 =("0"+(date1.getHours())).slice(-2);
    let min1 =("0"+(date1.getMinutes())).slice(-2);
    let sec1 =("0"+(date1.getSeconds())).slice(-2);

     //get the total seconds
      let y =(date1.getFullYear()-date.getFullYear())*86400;
      let m = (month1 - month)*86400;
      let d = (day1- day)*84600;
      let h = (hours1 - hours)*3600;
      let mi = (min1 - min)*60;
      let secs = (sec1 - sec);
      var seconds = y+m+d+h+mi+secs;

    //change seconds to a positive value if negative

       if (seconds > 0){
      var pastSeconds =seconds ; 
      }
      else{
        var pastSeconds = Math.abs(seconds); 
      }

    //converts  to timeago if time is less than a week

    //check the seconds
    if(pastSeconds <60){
      return parseInt(pastSeconds)+" seconds ago";
    }
    if(pastSeconds < 3600){
      return parseInt(pastSeconds/60)+" minutes ago";
    }
    if(pastSeconds <86400){
      return parseInt(pastSeconds/3600)+" hours ago";
    } 

     if(pastSeconds > 86400){
      if((pastSeconds/86400) > 2 && (pastSeconds/86400) < 6 ){

         return parseInt(pastSeconds/86400)+" days ago";

        }else if((pastSeconds/86400) > 6 && (pastSeconds/86400) < 14){

           return dates; //parseInt(pastSeconds/86400)+" a week ago";

        }else if((pastSeconds/86400) > 14 && (pastSeconds/86400) < 30){

           return dates;//parseInt(pastSeconds/86400)+" weeks ago";
        }
        else if((pastSeconds/86400) > 30 && (pastSeconds/86400) < 60 ){

          return dates;//parseInt(pastSeconds/86400)+" a month ago";

        }
        else if(((pastSeconds/86400) > 60 )){

          return dates ;//parseInt(pastSeconds/86400)+" months ago";

        }
        else if((pastSeconds/86400) > 1 && (pastSeconds/86400) > 2) {

          return parseInt(pastSeconds/86400)+" a day ago";

        }
      
    }

  }

  render() {

  const { error, hasMore, isLoading, products,ads} = this.state;
   
 return (

  <section className="items">
     <div className="collection-sort">
      <label>Sort by:</label>
      <select onChange={this.SortProducts}>
        <option value="All">All</option>
        <option value="price">Price</option>
        <option value="id">ProductID</option>
        <option value="size">Size</option>
      </select>
    </div>
  <div className="items">
 
        {products.length === 0 ? <div className="item">No products on this catalogue</div> :
          products.map(product => (
             <div>
               {
           <div className="item" key={product.id}>
           {product.img ?
            <div className="product-img">
              <img src={product.img}></img>
            </div>:
            <div className="product-img">
              {product.face}
            </div>
            }
            <div className="product-details">
              <h1 id="product-name"> Size:{product.size}</h1>
              <h4 id="product-description">Posted:{this.ConvertDate(product.date)}</h4>
            </div>
            <div className="price-add">
              <h5 id="product-price">${product.price}</h5>
             
            </div>
            <div className="button"><button>Buy Now</button></div>
          </div>
        }
         
             </div>
        ))
      }
   
        {isLoading &&
        <div className="content">
          {/* <div className="loader"></div> */}
          <div class="loading">Loading&#8230;</div>
          </div>
        }

         {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }

         {
         products.length === 0 ? null:
         hasMore === false ?
          <div className="info">~ end of catalogue ~</div>:null
        }
       </div>
        </section>
    );
  }
}

export default App;