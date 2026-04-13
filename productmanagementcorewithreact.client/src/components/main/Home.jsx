export default function Home() {
    return (
        <div>

            {/* 🔥 HERO SECTION */}
            <section className="bg-dark text-light text-center py-5">
                <div className="container">
                    <h1 className="fw-bold display-5">
                        Empowering Businesses with Smart, Secure & Scalable Solutions
                    </h1>
                    <p className="mt-3 fs-5">
                        We deliver next-generation software solutions that help businesses
                        automate processes, improve productivity, and achieve sustainable growth.
                    </p>

                    <button className="btn btn-warning mt-3 px-4 py-2">
                        Get Started
                    </button>
                </div>
            </section>

            {/* 🎯 SLIDER */}
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">

                    <div className="carousel-item active">
                        <img src="/images/Slider1.jpg" className="d-block w-100"
                            style={{ height: "400px", objectFit: "cover" }} />
                    </div>

                    <div className="carousel-item">
                        <img src="/images/Slider2.jpg" className="d-block w-100"
                            style={{ height: "400px", objectFit: "cover" }} />
                    </div>

                    <div className="carousel-item">
                        <img src="/images/Slider3.jpg" className="d-block w-100"
                            style={{ height: "400px", objectFit: "cover" }} />
                    </div>

                </div>

                {/* Controls */}
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>

                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>


            {/* 💡 ABOUT */}
            <section id="about" className="container py-5 text-center">
                <h2 className="fw-bold">Who We Are</h2>
                <p className="mt-3">
                    We are a technology-driven company focused on building scalable, secure,
                    and performance-oriented software solutions. Our expertise spans across
                    web applications, enterprise systems, cloud infrastructure, and digital
                    transformation services.
                </p>

                <p>
                    Our mission is to simplify complex business challenges through intuitive
                    and powerful digital tools. Whether you're a startup or a large enterprise,
                    our solutions are designed to adapt, scale, and grow with your business.
                </p>
            </section>

            {/* 🚀 SERVICES */}
            <section id="services" className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Our Core Services</h2>

                    <div className="row text-center">

                        <div className="col-md-4">
                            <div className="p-4 shadow-sm bg-white rounded">
                                <h5>💻 Custom Software Development</h5>
                                <p>
                                    We design and develop high-quality web and mobile applications
                                    tailored to your business requirements with modern technologies.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-4 shadow-sm bg-white rounded">
                                <h5>☁️ Cloud & Hosting Solutions</h5>
                                <p>
                                    Secure and scalable cloud hosting services with high uptime,
                                    performance optimization, and enterprise-level security.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-4 shadow-sm bg-white rounded">
                                <h5>📊 Business Automation Tools</h5>
                                <p>
                                    CRM systems, billing software, and workflow automation tools
                                    to streamline your operations and boost efficiency.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 🧩 PRODUCTS SECTION */}
            <section id="products" className="container py-5">
                <h2 className="text-center fw-bold mb-5">Our Product Ecosystem</h2>

                <div className="row">

                    <div className="col-md-6 mb-4">
                        <h5>📌 Employee and task Management</h5>
                        <p>
                            A complete CRM and project management system that helps teams manage
                            tasks, track progress, and collaborate efficiently.
                        </p>
                    </div>

                    <div className="col-md-6 mb-4">
                        <h5>📌 Billing Software</h5>
                        <p>
                            A fast and easy billing solution for small businesses to manage
                            invoices, GST, and customer records seamlessly.
                        </p>
                    </div>

                    <div className="col-md-6 mb-4">
                        <h5>📌 Server</h5>
                        <p>
                            High-performance hosting platform offering shared, VPS, and dedicated
                            server solutions with full reliability.
                        </p>
                    </div>

                    <div className="col-md-6 mb-4">
                        <h5>📌 Mart</h5>
                        <p>
                            A modern eCommerce marketplace platform connecting buyers and sellers
                            with a smooth and secure shopping experience.
                        </p>
                    </div>

                </div>
            </section>

            {/* 📈 STATS */}
            <section className="bg-dark text-light py-5">
                <div className="container text-center">
                    <h2 className="fw-bold mb-4">Our Achievements</h2>

                    <div className="row">

                        <div className="col-md-3">
                            <h3>200K+</h3>
                            <p>Business Growth</p>
                        </div>

                        <div className="col-md-3">
                            <h3>5K+</h3>
                            <p>Satisfied Clients</p>
                        </div>

                        <div className="col-md-3">
                            <h3>10+</h3>
                            <p>Countries Served</p>
                        </div>

                        <div className="col-md-3">
                            <h3>5+</h3>
                            <p>Awards Won</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* ⭐ WHY CHOOSE US */}
            <section className="container py-5">
                <h2 className="text-center fw-bold mb-4">Why Choose Us</h2>

                <div className="row text-center">

                    <div className="col-md-4">
                        <h6>✔ Experienced Team</h6>
                        <p>Highly skilled developers with real-world experience.</p>
                    </div>

                    <div className="col-md-4">
                        <h6>✔ Scalable Solutions</h6>
                        <p>Our systems grow with your business needs.</p>
                    </div>

                    <div className="col-md-4">
                        <h6>✔ 24/7 Support</h6>
                        <p>We ensure smooth operation with continuous support.</p>
                    </div>

                </div>
            </section>

            {/* 🔐 TRUST */}
            <section className="bg-light py-5 text-center">
                <div className="container">
                    <h2 className="fw-bold">Your Privacy is Our Priority</h2>
                    <p className="mt-3">
                        We never sell your data. Our business model is based on trust,
                        transparency, and delivering value through our software.
                    </p>
                </div>
            </section>
            {/* 📞 CONTACT US */}
            <section id="contact" className="py-5 bg-light">
                <div className="container">

                    <h2 className="text-center fw-bold mb-4">Contact Us</h2>
                    <p className="text-center mb-5">
                        Have a question or want to work with us? Fill out the form below and our team will get back to you shortly.
                    </p>

                    <div className="row">

                        {/* 📍 Contact Info */}
                        <div className="col-md-5 mb-4">
                            <div className="p-4 bg-white shadow-sm rounded h-100">

                                <h5>📍 Office Address</h5>
                                <p>Sector 63, Noida, Uttar Pradesh, India</p>

                                <h5>📧 Email</h5>
                                <p>kundan.mnbsoft@gmail.com</p>

                                <h5>📞 Phone</h5>
                                <p>+919798501225</p>

                            </div>
                        </div>

                        {/* 📨 Contact Form */}
                        <div className="col-md-7">
                            <div className="p-4 bg-white shadow-sm rounded">

                                <form>

                                    <div className="row">

                                        <div className="col-md-6 mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Your Name"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Your Email"
                                            />
                                        </div>

                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Subject"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Your Message"
                                        ></textarea>
                                    </div>

                                    <button className="btn btn-warning w-100">
                                        Send Message
                                    </button>

                                </form>

                            </div>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    );
}