import { BrowserRouter, Route, Routes } from "react-router-dom";
// import LoginP from "./pages/LoginP";
import CategoriesP from "./pages/CategoriesP";
import ProductsP from "./pages/ProductsP";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<CategoriesP />} />
          <Route path="categories" element={<CategoriesP />} />
          <Route path="products" element={<ProductsP />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
