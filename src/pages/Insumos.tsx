import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package, Pencil, Trash2 } from "lucide-react";
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
import { InsumoForm } from "@/components/Forms/InsumoForm";
import { useToast } from "@/hooks/use-toast";
import { useFetchInsumos } from "@/hooks/api/useFetchInsumos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInsumo } from "@/api/endpoints/insumos";

const Insumos = () => {
  const [open, setOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { insumos, totalPages } = useFetchInsumos(currentPage);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteInsumo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumos"] });
      toast({
        title: "Insumo excluído",
        description: "O insumo foi removido com sucesso.",
      });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir insumo",
        description: error.message || "Ocorreu um erro ao tentar excluir o insumo.",
        variant: "destructive",
      });
    },
  });

  const getEstoqueStatus = (estoque: number) => {
    if (estoque < 10) return { variant: "destructive" as const, label: "Baixo" };
    if (estoque < 30) return { variant: "default" as const, label: "Médio" };
    return { variant: "secondary" as const, label: "OK" };
  };

  const handleEdit = (insumo: any) => {
    setEditingInsumo(insumo);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingInsumo(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Insumos</h1>
            <p className="text-muted-foreground">Gerencie seu estoque de ingredientes</p>
          </div>
          <Button
            className="bg-gradient-primary shadow-md hover:shadow-lg transition-all"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Insumo
          </Button>
          <Dialog open={open} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingInsumo ? "Editar Insumo" : "Adicionar Novo Insumo"}</DialogTitle>
                <DialogDescription>
                  {editingInsumo
                    ? "Atualize os dados do insumo"
                    : "Preencha os dados do novo insumo para adicionar ao estoque"}
                </DialogDescription>
              </DialogHeader>
              <InsumoForm onSuccess={handleCloseDialog} initialData={editingInsumo} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Lista de Insumos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar insumo..." className="pl-10" />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insumos.map((insumo) => {
                    const status = getEstoqueStatus(Number(insumo.min_stock));
                    return (
                      <TableRow key={insumo.id}>
                        <TableCell className="font-medium">{insumo.name}</TableCell>
                        <TableCell>{insumo.unit}</TableCell>
                        <TableCell>{Number(insumo.min_stock).toFixed(1)}</TableCell>
                        <TableCell>{new Date().toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(insumo)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(insumo.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
              Tem certeza que deseja excluir este insumo? Esta ação não pode ser desfeita.
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

export default Insumos;
