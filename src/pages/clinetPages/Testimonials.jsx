import { HiStar } from "react-icons/hi";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Verified Buyer",
      rating: 5,
      comment: "Excellent service! The products are of premium quality and the delivery was super fast. Highly recommended!",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Regular Customer",
      rating: 5,
      comment: "I've been shopping here for months now. The quality is consistent and customer service is outstanding.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Verified Buyer",
      rating: 4,
      comment: "Great experience overall. Wide variety of products and good prices. Will shop again!",
      image: "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Regular Customer",
      rating: 5,
      comment: "Love the user-friendly website and quick checkout process. Products always arrive in perfect condition.",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Verified Buyer",
      rating: 5,
      comment: "Best online shopping experience! Genuine products, fair prices, and excellent customer support.",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 6,
      name: "Anita Desai",
      role: "Regular Customer",
      rating: 4,
      comment: "Really impressed with the quality and packaging. Fast delivery and hassle-free returns.",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up text-black">
            What Our Customers Say
          </h1>
          <p className="text-xl text-black/90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    className={`text-2xl ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-800 mb-6 leading-relaxed italic">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Thousands of Happy Customers
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Start your shopping journey with us today and experience the difference
          </p>
          <a
            href="/productlist"
            className="inline-block bg-primary-600 text-grey px-8 py-4 rounded-xl hover:bg-primary-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Shopping Now
          </a>
        </div>
      </div>
    </div>
  );
}
