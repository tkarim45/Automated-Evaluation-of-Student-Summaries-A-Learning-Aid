import pickle
import torch.nn as nn
import torch
from argparse import Namespace
from transformers import DebertaModel

# Define config globally
config = Namespace(hidden_dropout_prob=0.05, hidden_size=768)


class BertForSequenceRegression(nn.Module):
    def __init__(self, pretrained_model_name="microsoft/deberta-base", num_marks=2):
        super(BertForSequenceRegression, self).__init__()
        self.num_marks = num_marks
        self.bert = DebertaModel.from_pretrained(
            pretrained_model_name
        )  # Fresh DeBERTa model

        self.hidden_1 = nn.Linear(2 * config.hidden_size, 2 * config.hidden_size)
        self.notline_1 = nn.ReLU()
        self.dropout_1 = nn.Dropout(config.hidden_dropout_prob)
        self.hidden_2 = nn.Linear(2 * config.hidden_size, config.hidden_size)
        self.notline_2 = nn.ReLU()
        self.dropout_2 = nn.Dropout(config.hidden_dropout_prob)
        self.hidden = nn.Linear(config.hidden_size, 128)
        self.regres = nn.Linear(128, num_marks)

    def forward(
        self,
        input_ids,
        content_vector,
        token_type_ids=None,
        attention_mask=None,
        labels=None,
    ):
        output_bert = self.bert(
            input_ids=input_ids,
            token_type_ids=token_type_ids,
            attention_mask=attention_mask,
        ).last_hidden_state.mean(1)
        h_concat = torch.cat((content_vector, output_bert), dim=1)
        hidden_vec_1 = self.hidden_1(h_concat)
        hidden_drop_1 = self.dropout_1(hidden_vec_1)
        hidden_vecn_1 = self.notline_1(hidden_drop_1)
        hidden_vec_2 = self.hidden_2(hidden_vecn_1)
        hidden_drop_2 = self.dropout_2(hidden_vec_2)
        hidden_vecn_2 = self.notline_2(hidden_drop_2)
        hidden = self.hidden(hidden_vecn_2)
        marks = self.regres(hidden)
        return marks
