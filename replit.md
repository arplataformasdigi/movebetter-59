# MoveBetter - Physiotherapy Management System

## Overview

MoveBetter is a comprehensive physiotherapy practice management system built with React, TypeScript, and Supabase. The application features separate interfaces for administrators (physiotherapists) and patients, with real-time data synchronization and comprehensive patient management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state, React Context for auth
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Backend-as-a-Service**: Supabase (PostgreSQL + Auth + Real-time)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with custom user profiles
- **Real-time**: Supabase Realtime for live data updates
- **Server Functions**: Express.js API endpoints with Supabase client

### Data Layer
- **Database Client**: Supabase JavaScript client for database operations
- **Schema Management**: Supabase Dashboard for schema management
- **Real-time Subscriptions**: Supabase Realtime subscriptions

## Key Components

### Authentication System
- **Admin Authentication**: Standard email/password with Supabase Auth
- **Patient Authentication**: Custom patient login system with separate credentials
- **Role-based Access Control**: Admin and patient roles with different permissions
- **Profile Management**: Automatic profile creation on user registration

### Patient Management
- **Patient Records**: Comprehensive patient information storage
- **Medical Records**: Digital medical records with evolution tracking
- **Pre-evaluations**: Detailed patient assessment forms
- **Progress Tracking**: Patient progress scores and evolution history

### Treatment Plans (Trilhas)
- **Plan Creation**: Custom treatment plans with exercises
- **Exercise Library**: Reusable exercise database
- **Progress Monitoring**: Real-time tracking of plan completion
- **Patient Access**: Patients can view and interact with their plans

### Scheduling System
- **Calendar Integration**: React Big Calendar for appointment management
- **Real-time Updates**: Live appointment synchronization
- **Status Management**: Appointment status tracking (scheduled, completed, cancelled)

### Financial Management
- **Transaction Tracking**: Income and expense management
- **Category System**: Customizable transaction categories
- **Reporting**: Financial summaries and analytics
- **Package Proposals**: Treatment package pricing and proposals

### Patient App Interface
- **Dedicated Patient Portal**: Separate interface for patient access
- **Treatment Plan Viewing**: Patients can see their active plans
- **Progress Tracking**: View evolution and medical records
- **Appointment Management**: Schedule and manage appointments

## Data Flow

### Real-time Data Synchronization
1. **Database Changes**: Supabase triggers real-time events on data modifications
2. **Hook Subscriptions**: Custom hooks listen to specific table changes
3. **State Updates**: Local state automatically updates with server changes
4. **UI Reactivity**: Components re-render with new data

### Authentication Flow
1. **Login Request**: User submits credentials
2. **Supabase Auth**: Authentication processed by Supabase
3. **Profile Fetch**: User profile loaded from profiles table
4. **Context Update**: Auth context updates with user data
5. **Route Protection**: Protected routes check authentication status

### Form Handling
1. **Form Validation**: Zod schemas validate input data
2. **Submission**: React Hook Form handles form submission
3. **API Call**: Supabase client sends data to database
4. **Real-time Update**: Changes propagate via real-time subscriptions
5. **UI Feedback**: Toast notifications confirm actions

## External Dependencies

### Core Dependencies
- **Supabase**: Backend-as-a-Service for database, auth, and real-time
- **TanStack Query**: Server state management and caching
- **React Router**: Client-side routing
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Big Calendar**: Calendar component
- **jsPDF**: PDF generation for reports

### Development Dependencies
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and development server
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Deployment Strategy

### Production Build
- **Client Build**: Vite builds optimized React application
- **Server Bundle**: ESBuild bundles Express server for production
- **Static Assets**: Built files served from dist/public directory

### Environment Configuration
- **Database**: Supabase PostgreSQL (mdubcdedgtesrypicboc.supabase.co)
- **Authentication**: Supabase Auth with provided API keys
- **Real-time**: Automatic via Supabase Realtime
- **CDN**: Static assets served efficiently

### Replit Deployment
- **Build Command**: `npm run build` - builds both client and server
- **Start Command**: `npm run start` - runs production server
- **Development**: `npm run dev` - runs development server with hot reload
- **Database Push**: `npm run db:push` - applies schema changes

### Scaling Considerations
- **Database**: PostgreSQL supports horizontal scaling
- **Real-time**: Supabase Realtime handles connection pooling
- **File Storage**: Supabase Storage for future file uploads
- **CDN**: Built-in CDN via Supabase for static assets

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Reconnected Supabase with provided credentials (mdubcdedgtesrypicboc project)
- June 25, 2025. Fixed all Supabase client imports across 30+ hooks - eliminated "supabase is not defined" errors
- June 25, 2025. Successfully loading real data from 16 populated Supabase tables (5 patients, 4 sessions, 180 points)
- June 25, 2025. Completed full system correction - all components, contexts and pages now properly import Supabase client
- June 25, 2025. System fully operational with real data: profile data loading, authentication working, all features functional
- June 25, 2025. Implemented ViaCEP integration for automatic address lookup when entering CEP
- June 25, 2025. Added password change functionality through Supabase Auth with complete validation
- June 25, 2025. Enhanced address management with full address fields (CEP, street, number, complement, neighborhood, city, state)
- June 25, 2025. Fixed real-time CRUD operations - implemented Supabase subscriptions in all hooks (appointments, transactions, exercises, packages)
- June 25, 2025. Updated Dashboard to use realtime hooks for automatic data updates without page refresh
- June 25, 2025. COMPLETED MAJOR UPDATES: Real-time packages & treatment plans, evolution system with discharge restrictions, ranking with real patient data, save buttons added to personal data forms, patient proposal generation system restored
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```