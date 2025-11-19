import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FichaTecnicaForm } from "@/components/Forms/FichaTecnicaForm";
import { useToast } from "@/hooks/use-toast";

const initialFichas = [
  {
    id: 1,
    nome: "Massa ao Molho Vermelho",
    rendimento: 4,
    custoTotal: 18.5,
    precoVenda: 42.0,
    margemLucro: 56.0,
    ingredientes: 8,
    tempoPreparo: 30,
    modoPreparo: "Cozinhe o macarrão, refogue o molho e misture.",
  },
  {
    id: 2,
    nome: "Risoto de Funghi",
    rendimento: 2,
    custoTotal: 32.8,
    precoVenda: 78.0,
    margemLucro: 58.0,
    ingredientes: 12,
    tempoPreparo: 45,
    modoPreparo: "Refogue o arroz, adicione o caldo aos poucos.",
  },
  {
    id: 3,
    nome: "Filé à Parmegiana",
    rendimento: 1,
    custoTotal: 25.4,
    precoVenda: 65.0,
    margemLucro: 60.9,
    ingredientes: 10,
    tempoPreparo: 40,
    modoPreparo: "Empane o filé, frite e finalize com molho e queijo.",
  },
  {
    id: 4,
    nome: "Salada Caesar",
    rendimento: 2,
    custoTotal: 12.3,
    precoVenda: 32.0,
    margemLucro: 61.6,
    ingredientes: 6,
    tempoPreparo: 15,
    modoPreparo: "Misture os ingredientes frescos e adicione o molho.",
  },
];

const FichasTecnicas = () => {
  const [fichas, setFichas] = useState(initialFichas);
  const [open, setOpen] = useState(false);
  const [editingFicha, setEditingFicha] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleEdit = (ficha: any) => {
    setEditingFicha(ficha);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setFichas(fichas.filter((f) => f.id !== id));
    setDeleteId(null);
    toast({
      title: "Ficha técnica excluída",
      description: "A ficha técnica foi removida com sucesso.",
    });
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingFicha(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fichas Técnicas</h1>
            <p className="text-muted-foreground">Gerencie as receitas do seu cardápio</p>
          </div>
          <Button
            className="bg-gradient-primary shadow-md hover:shadow-lg transition-all"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Ficha
          </Button>
          <Dialog open={open} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFicha ? "Editar Ficha Técnica" : "Criar Nova Ficha Técnica"}
                </DialogTitle>
                <DialogDescription>
                  {editingFicha
                    ? "Atualize as informações do prato"
                    : "Preencha as informações básicas do prato"}
                </DialogDescription>
              </DialogHeader>
              <FichaTecnicaForm onSuccess={handleCloseDialog} initialData={editingFicha} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Lista de Fichas Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar ficha técnica..." className="pl-10" />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Prato</TableHead>
                    <TableHead>Rendimento</TableHead>
                    <TableHead>Ingredientes</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead>Preço de Venda</TableHead>
                    <TableHead>Margem de Lucro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fichas.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell className="font-medium">{ficha.nome}</TableCell>
                      <TableCell>{ficha.rendimento} porções</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ficha.ingredientes} itens</Badge>
                      </TableCell>
                      <TableCell>R$ {ficha.custoTotal.toFixed(2)}</TableCell>
                      <TableCell>R$ {ficha.precoVenda.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-success">{ficha.margemLucro.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(ficha)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(ficha.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ficha técnica? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default FichasTecnicas;
