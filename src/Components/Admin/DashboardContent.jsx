// src/Pages/DashboardContent.jsx
import React from 'react';

export default function DashboardContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="card">
        <h2>Total Revenue</h2>
        <div className="card-content">
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </div>
      </div>
      <div className="card">
        <h2>Subscriptions</h2>
        <div className="card-content">
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </div>
      </div>
      <div className="card">
        <h2>Sales</h2>
        <div className="card-content">
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </div>
      </div>
      <div className="card">
        <h2>Active Now</h2>
        <div className="card-content">
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </div>
      </div>
    </div>
  );
}