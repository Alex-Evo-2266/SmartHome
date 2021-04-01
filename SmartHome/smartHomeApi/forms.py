from django import forms
from .models import LocalImage

class ImageForm(forms.ModelForm):
    class Meta:
        model = LocalImage
        fields = ['image']
