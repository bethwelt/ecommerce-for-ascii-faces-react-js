import React, { Component } from "react";
import './Styles.css';

class App extends Component {
  constructor(props) {
    super(props);

    // Sets up our initial state
    this.state = {
      error: false,
      hasMore: true,
      limit:50,
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

  
      if (error || isLoading || !hasMore) return;
      if (
        window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight
      ) {
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

    //const ad  = [];
    //this.state.products.splice(this.state.ad,0,[{id:document.write('<img class="ad" src="http://localhost:3000/ads/?r=' + Math.floor(Math.random()*1000) + '"/>')}]);

    //   this.state.products.splice(this.state.ad,0,document.write('<img class="ad" src="http://localhost:3000/ads/?r=' + Math.floor(Math.random()*1000) + '"/>'));
this.setState({ isLoading: true }, () => {
      fetch(`http://localhost:3000/products?_page=${page}&_limit=${limit}`)
      .then(res => res.json())
      .then(result =>
        this.setState({ 
           products:this.state.products.concat(result),
            hasMore: (this.state.products.length < this.state.products.concat(result).length),
            isLoading: false,
            total:this.state.products.length+limit,
          }));
       });
    
     
  }
  

 SortProducts = (event) => {
  
  //Get sort parameter price,id,size
    const sort = event.target.value;
     //insert ad to the product list at position 20
    //this.state.products.splice(20,0,[{id:document.write('<img class="ad" src="http://localhost:3000/ads/?r=' + Math.floor(Math.random()*1000) + '"/>')}]);
    //set or refresh the array
    this.setState({ products:[]});
    //   this.state.products.splice(this.state.ad,0,document.write('<img class="ad" src="http://localhost:3000/ads/?r=' + Math.floor(Math.random()*1000) + '"/>'));
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


  render() {
  const { error, hasMore, isLoading, products} = this.state;
   
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
 
        { products.map(product => (

           <div className="item" key={product.id}>
          
            <div className="product-img">
              {product.face}
            </div>
            <div className="product-details">
              <h1 id="product-name"> Size:{product.size}</h1>
              <h4 id="product-description">Date :{product.date}</h4>
            </div>
            <div className="price-add">
              <h5 id="product-price">${product.price}</h5>
             
            </div>
            <div className="button"><button>Buy Now</button></div>
          </div>
        ))
      }
        {isLoading &&
          <div className="loader"><p></p></div>
        }

         {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }

         {
         products.length === 0 ? <div className="info">No products to display...</div> :
         hasMore === false ?
          <div className="info">End of Catalogue</div>:null
        }
       </div>
        </section>
    );
  }
}

export default App;