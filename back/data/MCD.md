CLIENT
- code_client (PK)
- nom

PRODUIT
- code_produit (PK)
- nom

COMMANDE
- code_commande (PK)
- date_commande
- date_livraison
- commentaire

✔ une commande a 1 client
✔ un client a 0..N commandes
CLIENT (1,N) —— PASSER —— (1,1) COMMANDE

CONTENIR
- quantité

✔ une commande contient au moins 1 produit
✔ un produit peut être dans 0..N commandes
COMMANDE (1,N) —— CONTENIR —— (0,N) PRODUIT
