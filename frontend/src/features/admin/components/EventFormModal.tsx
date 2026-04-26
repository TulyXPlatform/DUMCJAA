import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { type Event } from '../../events/types';

const schema = z.object({
  title:          z.string().min(3, 'Title must be at least 3 characters'),
  description:    z.string().min(10, 'Description must be at least 10 characters'),
  eventDate:      z.string().min(1, 'Event date is required'),
  location:       z.string().min(2, 'Location is required'),
  maxAttendees:   z.string().optional(),
});

type FormValues = z.infer<typeof schema>;



interface Props {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EventFormModal: React.FC<Props> = ({ isOpen, event, onClose, onSuccess }) => {
  const isEdit = !!event;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Populate form when editing
  useEffect(() => {
    if (event) {
      reset({
        title:        event.title,
        description:  event.description,
        eventDate:    event.eventDate.slice(0, 16),   // datetime-local format
        location:     event.location,
        maxAttendees: event.maxAttendees ? String(event.maxAttendees) : '',
      });
    } else {
      reset({ title: '', description: '', eventDate: '', location: '', maxAttendees: '' });
    }
  }, [event, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = { 
        ...values, 
        maxAttendees: values.maxAttendees ? parseInt(values.maxAttendees, 10) : undefined 
      };
      if (isEdit) {
        return apiClient.put(`/events/${event!.id}`, payload);
      }
      return apiClient.post('/events', payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
      onSuccess();
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Save failed'),
  });

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit event' : 'Create event'}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit(v => mutation.mutate(v as any))}>
          <div className="form-grid">
            <div className="form-field form-field--full">
              <label className="form-label" htmlFor="evt-title">Event Title *</label>
              <input id="evt-title" className={`form-input ${errors.title ? 'form-input--error' : ''}`} {...register('title')} placeholder="Annual Alumni Reunion 2026" />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="form-field form-field--full">
              <label className="form-label" htmlFor="evt-desc">Description *</label>
              <textarea id="evt-desc" className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`} {...register('description')} rows={3} placeholder="Describe the event..." />
              {errors.description && <p className="form-error">{errors.description.message}</p>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="evt-date">Date & Time *</label>
              <input id="evt-date" type="datetime-local" className={`form-input ${errors.eventDate ? 'form-input--error' : ''}`} {...register('eventDate')} />
              {errors.eventDate && <p className="form-error">{errors.eventDate.message}</p>}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="evt-max">Max Attendees</label>
              <input id="evt-max" type="number" min={1} className={`form-input ${errors.maxAttendees ? 'form-input--error' : ''}`} {...register('maxAttendees')} placeholder="Unlimited" />
              {errors.maxAttendees && <p className="form-error">{errors.maxAttendees.message}</p>}
            </div>

            <div className="form-field form-field--full">
              <label className="form-label" htmlFor="evt-loc">Location *</label>
              <input id="evt-loc" className={`form-input ${errors.location ? 'form-input--error' : ''}`} {...register('location')} placeholder="TSC Auditorium, Dhaka University" />
              {errors.location && <p className="form-error">{errors.location.message}</p>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 size={15} className="spin" />}
              {isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
