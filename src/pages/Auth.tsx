import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/utils/errors';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-x grid min-h-screen items-center gap-10 pb-12 pt-28 lg:grid-cols-2">
      <div className="hidden lg:block">
        <BrandLogo size="lg" />
        <h2 className="mt-8 font-title text-6xl leading-none text-white">Your squad.<br /><span className="text-neon">Your arena.</span></h2>
        <p className="mt-4 max-w-md text-lg text-dim">Register once to create teams, enter tournaments and get room details the moment a lobby opens.</p>
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-neon"><Shield size={16} /> Demo logins: admin@ffbattlearena.gg or player@ffbattlearena.gg with any 6+ character password</p>
      </div>
      <Panel className="mx-auto w-full max-w-md" innerClassName="p-6 sm:p-8">
        <h1 className="font-title text-3xl text-white">{title}</h1><p className="mb-6 text-dim">{subtitle}</p>{children}
      </Panel>
    </div>
  );
}

export function Login() {
  useDocumentTitle('Login', 'Log in to FF Battle Arena.');
  const { login } = useAuth();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [f, setF] = useState({ email: '', password: '', remember: true });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = {};
    if (!EMAIL.test(f.email)) v.email = 'Enter a valid email address.';
    if (f.password.length < 6) v.password = 'Password must be at least 6 characters.';
    setErr(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    try { const u = await login({ email: f.email, password: f.password }); nav(from ?? (u.role === 'admin' ? '/admin' : '/profile'), { replace: true }); }
    catch (x) { setErr({ form: getErrorMessage(x) }); }
    finally { setBusy(false); }
  };
  return (
    <Shell title="Login" subtitle="Welcome back, champion.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {err.form && <p role="alert" className="border border-red-500/60 bg-red-500/10 p-3 text-red-300">{err.form}</p>}
        <FormField label="Email" type="email" autoComplete="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} error={err.email} />
        <FormField label="Password" type="password" autoComplete="current-password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} error={err.password} />
        <label className="flex items-center gap-2 text-dim"><input type="checkbox" checked={f.remember} onChange={e => setF({ ...f, remember: e.target.checked })} className="h-4 w-4 accent-neon" /> Remember me</label>
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Logging in' : 'Login'}</Button>
        <p className="text-center text-dim">New here? <Link to="/register" className="text-neon hover:underline">Create an account</Link></p>
      </form>
    </Shell>
  );
}

export function Register() {
  useDocumentTitle('Register', 'Create your FF Battle Arena account.');
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ username: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = {};
    if (f.username.trim().length < 3) v.username = 'Username must be at least 3 characters.';
    if (!EMAIL.test(f.email)) v.email = 'Enter a valid email address.';
    if (f.password.length < 8) v.password = 'Password must be at least 8 characters.';
    if (f.confirm !== f.password) v.confirm = 'Passwords do not match.';
    setErr(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    try { await register({ username: f.username.trim(), email: f.email, password: f.password }); nav('/profile', { replace: true }); }
    catch (x) { setErr({ form: getErrorMessage(x) }); }
    finally { setBusy(false); }
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Shell title="Register" subtitle="Create an account to build your team.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {err.form && <p role="alert" className="border border-red-500/60 bg-red-500/10 p-3 text-red-300">{err.form}</p>}
        <FormField label="Username" autoComplete="username" value={f.username} onChange={set('username')} error={err.username} />
        <FormField label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} />
        <FormField label="Password" type="password" autoComplete="new-password" value={f.password} onChange={set('password')} error={err.password} />
        <FormField label="Confirm password" type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={err.confirm} />
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Creating account' : 'Register'}</Button>
        <p className="text-center text-dim">Already registered? <Link to="/login" className="text-neon hover:underline">Login</Link></p>
      </form>
    </Shell>
  );
}
