import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Load AI detection model
tokenizer = AutoTokenizer.from_pretrained("roberta-base-openai-detector")
model = AutoModelForSequenceClassification.from_pretrained("roberta-base-openai-detector")

def detect_ai_writing(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    ai_score = probabilities[0][1].item()
    
    return f"AI Probability: {ai_score * 100:.2f}%"

# Test the function
sample_text = "In conclusion, the integration of artificial intelligence presents significant benefits."
result = detect_ai_writing(sample_text)
print(result)
