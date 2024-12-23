import React, { useCallback, useEffect, useState } from "react";
import { addProduct, deleteProduct, fetchProducts, modifyProduct, searchProducts } from "../../api/productService";
import Pagination from "../Pagination/Pagination";
import Dashboard from "../dashboard/Dashboard";
import Search from "../searchbar/Search";
import ProductForm from "./ProduitForm";
import ProductTable from "./ProduitTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Produits = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    image: '',
    name: '',
    price: '',
    description: ''
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Get the role from localStorage
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchProductsData();
  }, [currentPage]);

  const fetchProductsData = async () => {
    try {
      const { products, totalPages } = await fetchProducts(currentPage);
      setProducts(products);
      setFilteredProducts(products);
      setTotalPages(totalPages); // Set the total number of pages
    } catch (error) {
      console.error('Error fetching products', error);
      toast.error('Erreur lors de la récupération des produits.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await deleteProduct(id);
        fetchProductsData();
        toast.success('Produit supprimé avec succès!');
      } catch (error) {
        console.error('Error deleting product', error);
        toast.error('Erreur lors de la suppression du produit.');
      }
    }
  };

  const handleModify = (product) => {
    setCurrentProduct(product);
    setNewProduct(product);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await modifyProduct(newProduct);
      fetchProductsData();
      setShowForm(false);
      toast.success('Produit modifié avec succès!');
    } catch (error) {
      console.error('Error modifying product', error);
      toast.error('Erreur lors de la modification du produit.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
      fetchProductsData();
      setShowForm(false);
      toast.success('Produit ajouté avec succès!');
    } catch (error) {
      console.error('Error adding product', error);
      toast.error('Erreur lors de l\'ajout du produit.');
    }
  };

  const handleSearch = async (searchTerm) => {
    if (searchTerm === '') {
      setIsSearchActive(false);
      fetchProductsData();
    } else {
      try {
        const response = await searchProducts(searchTerm);
        setFilteredProducts(response);
        setIsSearchActive(true);
      } catch (error) {
        console.error('Error searching products', error);
        toast.error('Erreur lors de la recherche de produits.');
      }
    }
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <div className="flex h-screen">
      <Dashboard title="Produit" />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="container mx-auto p-9 relative mt-20">
          <ToastContainer />
          <Search setData={handleSearch} title={"Tout les Produits"} />
          {/* {role !== 'market' && ( // Conditionally render the button
            <button
              className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
              onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                setNewProduct({
                  image: '',
                  name: '',
                  price: '',
                  description: ''
                });
              }}
            >
              Ajouter un Produit
            </button>
          )} */}
          {showForm && (
            <ProductForm
              newProduit={newProduct}
              handleAddProduit={handleAddProduct}
              handleEditProduit={handleEditProduct}
              handleChange={handleChange}
              setShowForm={setShowForm}
              isEditMode={isEditMode}
            />
          )}
          <ProductTable produits={filteredProducts} handleDelete={handleDelete} handleModify={handleModify} />
          <Pagination 
            currentPage={currentPage} 
            setCurrentPage={handlePageChange} 
            totalPages={totalPages} 
          />
        </div>
      </div>
    </div>
  );
}

export default Produits;
