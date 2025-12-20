export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About AMFOFANA HIGH SCHOOL</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Inspiring excellence, discipline, and future leadership for every student.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-b from-blue-600 to-transparent"></div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Mission */}
          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At AMFOFANA High School, our mission is to provide quality education
              that nurtures each student’s academic growth, character development,
              and leadership mindset — shaping future innovators and achievers.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We envision a school where students are empowered with the knowledge,
              discipline, and values needed to excel in higher education and life,
              while contributing positively to society.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,500+", label: "Students" },
              { number: "80+", label: "Teachers" },
              { number: "25+", label: "Years of Excellence" },
              { number: "98%", label: "Graduation Rate" },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-3xl font-bold text-blue-700">{stat.number}</h3>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center">Our History</h2>
          <p className="mt-6 text-gray-700 leading-relaxed text-lg text-center">
            AMFOFANA High School was founded with the goal of transforming education
            and creating a safe, supportive environment for students to learn and grow.
            Over the years, we have built a strong reputation based on academic
            excellence, discipline, and a commitment to student success.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">Our Core Values</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {[
              {
                title: "Excellence",
                desc: "We push our students to achieve their highest academic and personal potential."
              },
              {
                title: "Discipline",
                desc: "We instill responsibility, respect, and strong moral character."
              },
              {
                title: "Innovation",
                desc: "We encourage creative thinking and modern learning approaches."
              }
            ].map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
                <h3 className="text-xl font-semibold">{val.title}</h3>
                <p className="mt-3 text-gray-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Message */}
      <section className="py-16 text-center container mx-auto px-6">
        <h2 className="text-2xl font-semibold">Join the AMFOFANA Family</h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Together, we build a brighter future — one student at a time.
        </p>
      </section>
    </div>
  );
}

