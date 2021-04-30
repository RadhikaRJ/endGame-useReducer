import React from "react";
import "./styles.css";
import { useReducer, useState } from "react";
import faker from "faker";

faker.seed(123);

const data = [...Array(50)].map((item) => ({
  id: faker.random.uuid(),
  name: faker.commerce.productName(),
  image: faker.random.image(),
  price: faker.commerce.price(),
  material: faker.commerce.productMaterial(),
  brand: faker.lorem.word(),
  inStock: faker.random.boolean(),
  fastDelivery: faker.random.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  offer: faker.random.arrayElement([
    "Save 50",
    "70% bonanza",
    "Republic Day Sale"
  ]),
  idealFor: faker.random.arrayElement([
    "Men",
    "Women",
    "Girl",
    "Boy",
    "Senior"
  ]),
  level: faker.random.arrayElement([
    "beginner",
    "amateur",
    "intermediate",
    "advanced",
    "professional"
  ]),
  color: faker.commerce.color()
}));

export default function App() {
  function cartReducer(state, action) {
    switch (action.type) {
      case "SORT":
        return { ...state, sortBy: action.payload };
        break;

      case "TOGGLE_INVENTORY":
        return (state = {
          ...state,
          showInventoryAll: !state.showInventoryAll
        });
        break;
      case "TOGGLE_DELIVERY":
        return (state = {
          ...state,
          showFastdeliveryonly: !state.showFastdeliveryonly
        });
      default:
        return state;
    }
  }
  const [
    { sortBy, showInventoryAll, showFastdeliveryonly },
    dispatch
  ] = useReducer(cartReducer, {
    showInventryAll: true,
    showFastdeliveryonly: false,
    sortBy: null
  });

  function getSortedData(productlist, sortBy) {
    if (sortBy && sortBy === "PRICE_HIGH_TO_LOW") {
      return productlist.sort((a, b) => b["price"] - a["price"]);
    }

    if (sortBy && sortBy === "PRICE_LOW_TO_HIGH") {
      return productlist.sort((a, b) => a["price"] - b["price"]);
    }
    return productlist;
  }

  function getSortedFilteredData(
    productlisting,
    { showFastdeliveryonly, showInventoryAll }
  ) {
    return productlisting
      .filter(({ fastDelivery }) =>
        showFastdeliveryonly ? fastDelivery : true
      )
      .filter(({ inStock }) => (showInventoryAll ? true : inStock));
  }

  const sortedData = getSortedData(data, sortBy);
  const filteredData = getSortedFilteredData(sortedData, {
    showFastdeliveryonly,
    showInventoryAll
  });

  const [priceRange, setpriceRange] = useState(250);
  console.log({ priceRange });

  function getFilteredByPriceData(productlist, priceRange) {
    return productlist.filter(({ price }) =>
      price <= priceRange ? true : false
    );
  }
  const filteredByPriceData = getFilteredByPriceData(filteredData, priceRange);

  return (
    <>
      <div style={{ border: "1px solid black", margin: "1rem" }}>
        <div>
          <p style={{ display: "flex", flexWrap: "wrap", padding: "1rem" }}>
            Sort Price <br></br>
            <input
              type="radio"
              id="low_to_high"
              name="price_sort"
              value="low_to_high"
              onChange={() =>
                dispatch({ type: "SORT", payload: "PRICE_LOW_TO_HIGH" })
              }
              checked={sortBy && sortBy === "PRICE_LOW_TO_HIGH"}
            />
            <label for="low_to_high">low_to_high</label>
            <input
              type="radio"
              id="high_to_low"
              name="price_sort"
              value="high_to_low"
              onChange={() =>
                dispatch({ type: "SORT", payload: "PRICE_HIGH_TO_LOW" })
              }
              checked={sortBy && sortBy === "PRICE_HIGH_TO_LOW"}
            />
            <label for="high_to_low">high_to_low</label>
          </p>
          <p style={{ display: "flex", flexWrap: "wrap", padding: "1rem" }}>
            Preferences: <br></br>
            <input
              type="checkbox"
              id="outOfStock"
              name="otherFactors"
              onChange={() => dispatch({ type: "TOGGLE_INVENTORY" })}
              checked={showInventoryAll}
            />
            <label for="outOfStock">Include Out Of Stock</label>
            <input
              type="checkbox"
              id="slowDelivery"
              name="otherFactors"
              onChange={() => dispatch({ type: "TOGGLE_DELIVERY" })}
              checked={showFastdeliveryonly}
            />
            <label for="slowDelivery">Fast Delivery Only</label>
          </p>
          <p>
            <label for="price-range">Price range:</label>
            <input
              type="range"
              id="price-range"
              min="250"
              max="1000"
              onChange={(e) => {
                setpriceRange(e.target.value);
                dispatch({ type: "SET_PRICE_RANGE", payload: priceRange });
              }}
            />
          </p>
        </div>
      </div>
      <div className="App" style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredByPriceData.map(
          ({
            id,
            name,
            image,
            price,
            productName,
            inStock,
            level,
            fastDelivery
          }) => (
            <div
              key={id}
              style={{
                border: "1px solid #4B5563",
                borderRadius: "0 0 0.5rem 0.5rem",
                margin: "1rem",
                maxWidth: "40%",
                padding: "0 0 1rem"
              }}
            >
              <img src={image} width="100%" height="auto" alt={productName} />
              <h3> {name} </h3>
              <div>Rs. {price}</div>
              {inStock && <div> In Stock </div>}
              {!inStock && <div> Out of Stock </div>}
              <div>{level}</div>
              {fastDelivery ? (
                <div> Fast Delivery </div>
              ) : (
                <div> 3 days minimum </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}
