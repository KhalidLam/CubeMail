import { toast } from 'sonner'

export function useToast() {
  return {
    toast: ({ title, description, status = 'default', duration = 4000, isClosable = true }) => {
      const message = description || title
      
      switch (status) {
        case 'success':
          return toast.success(title, {
            description,
            duration: isClosable ? duration : Infinity,
          })
        case 'error':
          return toast.error(title, {
            description,
            duration: isClosable ? duration : Infinity,
          })
        case 'warning':
          return toast.warning(title, {
            description,
            duration: isClosable ? duration : Infinity,
          })
        case 'info':
          return toast.info(title, {
            description,
            duration: isClosable ? duration : Infinity,
          })
        default:
          return toast(title, {
            description,
            duration: isClosable ? duration : Infinity,
          })
      }
    }
  }
}