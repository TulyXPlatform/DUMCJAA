import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Save, Globe, Lock, Database } from 'lucide-react';

const schema = z.object({
  platformName:    z.string().min(2, 'Name is required'),
  contactEmail:    z.string().email('Must be a valid email'),
  supportPhone:    z.string().optional(),
  requireApproval: z.boolean(),
  allowPublicDirectory: z.boolean(),
  maintenanceMode: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT: FormValues = {
  platformName:         'DUMCJAA',
  contactEmail:         'admin@dumcjaa.org',
  supportPhone:         '+880 1700 000000',
  requireApproval:      true,
  allowPublicDirectory: true,
  maintenanceMode:      false,
};

const ToggleField: React.FC<{ id: string; label: string; description: string; checked: boolean; onChange: () => void }> = ({
  id, label, description, checked, onChange,
}) => (
  <div className="settings-toggle-row">
    <div>
      <label className="settings-toggle-label" htmlFor={id}>{label}</label>
      <p className="settings-toggle-desc">{description}</p>
    </div>
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      className={`settings-toggle-btn ${checked ? 'settings-toggle-btn--on' : ''}`}
      onClick={onChange}
    >
      <span className="settings-toggle-thumb" />
    </button>
  </div>
);

export const AdminSettings: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isDirty }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT,
  });

  const values = watch();

  const onSubmit = (data: FormValues) => {
    // In production this would POST to /api/settings
    console.log('Settings saved', data);
    toast.success('Settings saved successfully!');
  };

  const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-icon">{icon}</span>
        <h3 className="settings-section-title">{title}</h3>
      </div>
      <div className="settings-section-body">{children}</div>
    </div>
  );

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Platform Settings</h1>
          <p className="admin-page-subtitle">Manage global platform configuration and preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
        {/* General */}
        <Section icon={<Globe size={18} />} title="General">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="s-name">Platform Name *</label>
              <input id="s-name" className={`form-input ${errors.platformName ? 'form-input--error' : ''}`} {...register('platformName')} />
              {errors.platformName && <p className="form-error">{errors.platformName.message}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="s-email">Contact Email *</label>
              <input id="s-email" className={`form-input ${errors.contactEmail ? 'form-input--error' : ''}`} {...register('contactEmail')} />
              {errors.contactEmail && <p className="form-error">{errors.contactEmail.message}</p>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="s-phone">Support Phone</label>
              <input id="s-phone" className="form-input" {...register('supportPhone')} placeholder="+880 ..." />
            </div>
          </div>
        </Section>

        {/* Privacy & Access */}
        <Section icon={<Lock size={18} />} title="Privacy & Access Control">
          <ToggleField
            id="require-approval"
            label="Require Admin Approval"
            description="New alumni registrations require manual admin approval before gaining access."
            checked={values.requireApproval}
            onChange={() => setValue('requireApproval', !values.requireApproval, { shouldDirty: true })}
          />
          <ToggleField
            id="public-directory"
            label="Public Alumni Directory"
            description="Allow unauthenticated visitors to browse the alumni directory."
            checked={values.allowPublicDirectory}
            onChange={() => setValue('allowPublicDirectory', !values.allowPublicDirectory, { shouldDirty: true })}
          />
        </Section>

        {/* Maintenance */}
        <Section icon={<Database size={18} />} title="System">
          <ToggleField
            id="maintenance"
            label="Maintenance Mode"
            description="Take the platform offline for maintenance. Admins can still log in."
            checked={values.maintenanceMode}
            onChange={() => setValue('maintenanceMode', !values.maintenanceMode, { shouldDirty: true })}
          />
          {values.maintenanceMode && (
            <div className="settings-warning-banner">
              ⚠️ Maintenance mode is ON. The public site is currently inaccessible to alumni.
            </div>
          )}
        </Section>

        <div className="settings-submit-row">
          <button type="submit" className="btn btn-primary" disabled={!isDirty}>
            <Save size={15} /> Save Settings
          </button>
          {!isDirty && <span className="settings-saved-hint">All changes are saved.</span>}
        </div>
      </form>
    </div>
  );
};
