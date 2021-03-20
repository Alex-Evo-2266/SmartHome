from django import forms
from .models import ImageBackground

class BackgroundForm(forms.ModelForm):
    class Meta:
        model = ImageBackground
        fields = ['image']
