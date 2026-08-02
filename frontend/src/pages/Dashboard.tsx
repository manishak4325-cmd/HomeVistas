import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'User') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Mock getting own properties - wait, we don't have an endpoint specifically for "my properties" 
        // We can use the main one and filter by user if the backend supported it. 
        // Or we just fetch inquiries which will return inquiries for their properties.
        const inquiriesRes = await api.get('/inquiries');
        setInquiries(inquiriesRes.data);

        // Since we didn't make a /api/properties/mine, let's fetch all and filter on frontend for now 
        // (Not ideal for prod, but works for the scope without modifying backend again)
        const propsRes = await api.get('/properties?pageSize=100');
        const myProps = propsRes.data.properties.filter((p: any) => p.owner._id === user._id);
        setProperties(myProps);

      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        setProperties(properties.filter((p: any) => p._id !== id));
        toast.success('Property deleted');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <button 
          onClick={() => toast('Property creation form would open here.')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Properties */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">My Properties</h2>
          {properties.length === 0 ? (
            <p className="text-muted-foreground">You haven't listed any properties yet.</p>
          ) : (
            <div className="space-y-4">
              {properties.map((property: any) => (
                <div key={property._id} className="flex justify-between items-center border-b border-border pb-4">
                  <div className="flex items-center gap-4">
                    <img src={property.images[0]} alt={property.title} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                      <h4 className="font-semibold">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">${property.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(property._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiries */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground">No inquiries received yet.</p>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq: any) => (
                <div key={inq._id} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{inq.name}</span>
                    <span className="text-sm text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mb-1"><span className="font-medium">Property:</span> {inq.property?.title}</p>
                  <p className="text-sm mb-1"><span className="font-medium">Contact:</span> {inq.email} | {inq.phone}</p>
                  <p className="text-sm mt-2 p-2 bg-background rounded border border-border">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
