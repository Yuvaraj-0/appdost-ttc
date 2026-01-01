import { useState } from "react";
import { addProduct } from "../../../adminServices/addproduct";
import { UserAuth } from "../../../context/AuthContext";
import { HiPlus, HiPhotograph, HiCheckCircle, HiX } from "react-icons/hi";

export default function AddProduct() {
  const { session } = UserAuth();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [taskImage, setTaskImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Protect page
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-red-500 text-lg font-semibold">Login required to access this page</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTaskImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setTaskImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addProduct(form, taskImage);
      setMessage("success");

      // Reset form
      setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
      });
      setTaskImage(null);
      setImagePreview(null);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`error: ${err.message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Fill in the details to add a product to your inventory</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                name="name"
                placeholder="e.g., Premium Wireless Headphones"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  name="category"
                  placeholder="e.g., Electronics"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  name="price"
                  type="number"
                  placeholder="e.g., 2999"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                name="stock"
                type="number"
                placeholder="e.g., 50"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your product features, specifications, etc."
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Image
              </label>
              
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HiPhotograph className="text-6xl text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-600 font-semibold">
                      Click to upload product image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>
              )}
            </div>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  message === "success"
                    ? "bg-green-50 border-2 border-green-200 text-green-700"
                    : "bg-red-50 border-2 border-red-200 text-red-700"
                }`}
              >
                {message === "success" ? (
                  <>
                    <HiCheckCircle className="text-2xl" />
                    <span className="font-semibold">Product added successfully!</span>
                  </>
                ) : (
                  <span className="font-semibold">{message}</span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <HiPlus className="text-2xl" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
