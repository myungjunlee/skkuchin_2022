from djoser import email

class ActivationEmail(email.ActivationEmail):
    template_name = 'email/activation.html'

    def send(self, to, *args, **kwargs):
        if not self.context['user'].is_active:
            super().send(to, *args, **kwargs)

class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'email/password_reset.html'
