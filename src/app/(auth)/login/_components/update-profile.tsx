'use client';

import React, { useState } from 'react';
import useUpdateProfile from '../_hooks/use-update-profile';

export default function UpdateProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { isPending, error, updateProfile } = useUpdateProfile();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateProfile({ firstName, lastName });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-zinc-400 mb-1.5">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-zinc-400 mb-1.5">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-amber-500 py-3 px-4 font-medium text-zinc-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? 'Updating...' : 'Update Profile'}
      </button>
      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}
    </form>
  )
}
