import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
  });

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/locations');
      setLocations(res.data);
    } catch (err) {
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/locations', form);
      setLocations((prev) => [res.data, ...prev]);
      setForm({ name: '', address: '', city: '', country: '' });
      toast.success('Location added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this location?')) return;
    try {
      await axiosInstance.delete(`/locations/${id}`);
      setLocations((prev) => prev.filter((l) => l.id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold">Locations</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Pickup & return points for your fleet.
        </p>
      </div>

      <Card className="p-5">
        <form
          onSubmit={onCreate}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
        >
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <div className="lg:col-span-4">
            <Button type="submit" leftIcon={<Plus size={14} />}>
              Add location
            </Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-elevated)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Address</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Country</th>
              <th className="text-right p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">
                  Loading…
                </td>
              </tr>
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">
                  <MapPin size={20} className="mx-auto mb-2" />
                  No locations yet.
                </td>
              </tr>
            ) : (
              locations.map((l) => (
                <tr key={l.id}>
                  <td className="p-3 font-medium">{l.name}</td>
                  <td className="p-3 text-[var(--color-muted)]">{l.address || '—'}</td>
                  <td className="p-3">{l.city || '—'}</td>
                  <td className="p-3">{l.country || '—'}</td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(l.id)}
                      leftIcon={<Trash2 size={14} />}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminLocations;
