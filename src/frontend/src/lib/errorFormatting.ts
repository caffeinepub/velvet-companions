export function formatError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    // Handle ban errors
    if (message.includes('banned') || message.includes('Banned')) {
      return 'Your account has been permanently banned due to non-payment of commission fees.';
    }
    
    // Handle commission-related errors
    if (message.includes('commission') || message.includes('Commission')) {
      if (message.includes('not found')) {
        return 'Commission record not found.';
      }
      return 'There was an issue processing your commission payment.';
    }
    
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
