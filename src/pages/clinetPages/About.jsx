import { HiShieldCheck, HiTruck, HiHeart, HiUsers } from "react-icons/hi";

export default function About() {
  const values = [
    {
      icon: HiShieldCheck,
      title: "Quality Assurance",
      description: "We ensure every product meets our high standards of quality and authenticity."
    },
    {
      icon: HiTruck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your products to you as soon as possible."
    },
    {
      icon: HiHeart,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We're here to help every step of the way."
    },
    {
      icon: HiUsers,
      title: "Trusted by Thousands",
      description: "Join our growing community of satisfied customers across the country."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up text-black">
            About E-Shop
          </h1>
          <p className="text-xl text-black/90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Your trusted destination for premium quality products at unbeatable prices
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            Founded with a vision to make premium shopping accessible to everyone, E-Shop has grown from a small startup to a trusted e-commerce platform serving thousands of customers nationwide.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe in offering quality products, exceptional customer service, and a seamless shopping experience. Every product in our catalog is carefully selected to ensure it meets our high standards.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-all hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-800">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 animate-fade-in-up">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2 text-black">10K+</p>
              <p className="text-white/90 text-lg">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2 text-black">50K+</p>
              <p className="text-white/90 text-lg">Products Sold</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2 text-black">98%</p>
              <p className="text-white/90 text-lg">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-8">
            To provide our customers with the best online shopping experience by offering premium quality products, exceptional customer service, and unbeatable value. We're committed to building lasting relationships with our customers based on trust, transparency, and excellence.
          </p>
          <a
            href="/productlist"
            className="inline-block bg-primary-600 text-black px-8 py-4 rounded-xl hover:bg-primary-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
