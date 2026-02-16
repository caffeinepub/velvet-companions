export function formatError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    // Handle authorization errors
    if (message.includes('Unauthorized')) {
      if (message.includes('matched users') || message.includes('booking relationship')) {
        return 'You can only message users you have a booking relationship with.';
      }
      return 'You do not have permission to perform this action.';
    }
    
    // Handle fee-related errors
    if (message.includes('Fee not paid')) {
      return 'Please confirm the one-time ₹10 fee to create your profile.';
    }
    
    if (message.includes('not found')) {
      return 'The requested item could not be found.';
    }
    
    if (message.includes('already exists')) {
      return 'This item already exists.';
    }
    
    return message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
