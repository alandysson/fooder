import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FichaTecnicaForm } from "@/components/Forms/FichaTecnicaForm";
import { useToast } from "@/hooks/use-toast";
import { useFetchFichas } from "@/hooks/api/useFetchFichas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFichas } from "@/api/endpoints/fichastecnicas";

const FichasTecnicas = () => {
  const [open, setOpen] = useState(false);
  const [editingFicha, setEditingFicha] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { fichas, totalPages } = useFetchFichas(currentPage);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEdit = (ficha: any) => {
    setEditingFicha(ficha);
    setOpen(true);
  };

  const mutation = useMutation({
    mutationFn: deleteFichas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
      toast({
        title: "Ficha técnica excluída",
        description: "A ficha técnica foi removida com sucesso.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Erro ao excluir ficha técnica",
        description: "Ocorreu um erro ao tentar excluir a ficha técnica.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
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
                    <TableHead>SKU</TableHead>
                    <TableHead>Ingredientes</TableHead>
                    <TableHead>Preço de Venda</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fichas.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell className="font-medium">{ficha?.name}</TableCell>
                      <TableCell className="text-muted-foreground">{ficha?.sku || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ficha.recipe?.items?.length} itens</Badge>
                      </TableCell>
                      <TableCell>R$ {Number(ficha.price).toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge variant={ficha.is_active ? "default" : "outline"} className="text-xs">
                            {ficha.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit({ ...ficha, ingredients: ficha.recipe?.items })}
                          >
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
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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
