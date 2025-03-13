import { Link } from 'wouter';
import { CATEGORIES } from '@/lib/constants';

export default function CategorySection() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <p className="text-gray-600">Explore our wide range of products</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(category => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 flex items-center justify-center bg-${category.color}-100 rounded-full mb-4`}>
                <i className={`${category.icon} text-${category.color}-600 text-xl`}></i>
              </div>
              <span className="font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
